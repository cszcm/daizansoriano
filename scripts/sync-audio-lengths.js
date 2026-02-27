const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIRS = ['_posts', '_podcast'];
const AUDIO_LENGTH_LINE_RE = /^audio_length:\s*.*$/m;
const AUDIO_URL_LINE_RE = /^audio_url:\s*(.+)\s*$/m;
const AUDIO_TYPE_LINE_RE = /^audio_type:\s*.*$/m;
const FRONT_MATTER_RE = /^---\n([\s\S]*?)\n---\n?/;

function walkMarkdownFiles(startDir) {
  const out = [];
  if (!fs.existsSync(startDir)) return out;
  const stack = [startDir];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
        continue;
      }
      if (entry.isFile() && (full.endsWith('.md') || full.endsWith('.markdown'))) {
        out.push(full);
      }
    }
  }
  return out;
}

function getRelativePosix(absPath) {
  return path.relative(ROOT, absPath).split(path.sep).join('/');
}

function getInferredAudioUrl(relPath) {
  let relWithoutCollection = relPath;
  if (relPath.startsWith('_posts/')) {
    relWithoutCollection = relPath.slice('_posts/'.length);
  } else if (relPath.startsWith('_podcast/')) {
    relWithoutCollection = relPath.slice('_podcast/'.length);
  }
  const mp3Rel = relWithoutCollection
    .replace(/\.markdown$/i, '.mp3')
    .replace(/\.md$/i, '.mp3');
  return `/audio/${mp3Rel}`;
}

function normalizeYamlStringValue(raw) {
  const trimmed = raw.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function resolveAudioFilePath(frontMatter, relPath) {
  const audioUrlMatch = frontMatter.match(AUDIO_URL_LINE_RE);
  const audioUrlRaw = audioUrlMatch ? normalizeYamlStringValue(audioUrlMatch[1]) : '';
  const audioUrl = audioUrlRaw || getInferredAudioUrl(relPath);

  if (!audioUrl || audioUrl.includes('://')) {
    return null;
  }

  const normalizedUrl = audioUrl.startsWith('/') ? audioUrl.slice(1) : audioUrl;
  return path.join(ROOT, normalizedUrl);
}

function upsertAudioLength(frontMatter, audioLength) {
  const newLine = `audio_length: ${audioLength}`;
  if (AUDIO_LENGTH_LINE_RE.test(frontMatter)) {
    return frontMatter.replace(AUDIO_LENGTH_LINE_RE, newLine);
  }

  if (AUDIO_TYPE_LINE_RE.test(frontMatter)) {
    return frontMatter.replace(AUDIO_TYPE_LINE_RE, (line) => `${line}\n${newLine}`);
  }

  if (AUDIO_URL_LINE_RE.test(frontMatter)) {
    return frontMatter.replace(AUDIO_URL_LINE_RE, (line) => `${line}\n${newLine}`);
  }

  const trimmed = frontMatter.replace(/\s+$/, '');
  return `${trimmed}\n${newLine}\n`;
}

function main() {
  const files = CONTENT_DIRS.flatMap((dir) => walkMarkdownFiles(path.join(ROOT, dir)));
  let scanned = 0;
  let updated = 0;
  let skippedNoFrontMatter = 0;
  let skippedNoLocalAudio = 0;
  let skippedMissingAudioFile = 0;

  for (const absPath of files) {
    scanned += 1;
    const relPath = getRelativePosix(absPath);
    const content = fs.readFileSync(absPath, 'utf8');
    const match = content.match(FRONT_MATTER_RE);
    if (!match) {
      skippedNoFrontMatter += 1;
      continue;
    }

    const frontMatter = match[1];
    const body = content.slice(match[0].length);
    const audioFilePath = resolveAudioFilePath(frontMatter, relPath);

    if (!audioFilePath) {
      skippedNoLocalAudio += 1;
      continue;
    }

    if (!fs.existsSync(audioFilePath)) {
      skippedMissingAudioFile += 1;
      continue;
    }

    const stats = fs.statSync(audioFilePath);
    if (!stats.isFile()) {
      skippedMissingAudioFile += 1;
      continue;
    }

    const nextFrontMatter = upsertAudioLength(frontMatter, stats.size);
    if (nextFrontMatter === frontMatter) {
      continue;
    }

    const normalizedFrontMatter = nextFrontMatter.endsWith('\n')
      ? nextFrontMatter
      : `${nextFrontMatter}\n`;
    const nextContent = `---\n${normalizedFrontMatter}---\n${body}`;
    fs.writeFileSync(absPath, nextContent, 'utf8');
    updated += 1;
    console.log(`Updated ${relPath} -> audio_length: ${stats.size}`);
  }

  console.log('');
  console.log(`Scanned: ${scanned}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped (no front matter): ${skippedNoFrontMatter}`);
  console.log(`Skipped (no local audio URL): ${skippedNoLocalAudio}`);
  console.log(`Skipped (audio file missing): ${skippedMissingAudioFile}`);
}

main();
