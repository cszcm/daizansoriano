#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT_DIRS = ['_posts'];
const AUDIO_DIR = path.join(ROOT, 'audio');
const API_URL = 'https://api.openai.com/v1/audio/speech';
const FRONT_MATTER_RE = /^---\n([\s\S]*?)\n---\n?/;

const argv = process.argv.slice(2);
const flags = new Set(argv.filter((arg) => arg.startsWith('--')));
const targets = argv.filter((arg) => !arg.startsWith('--'));

const force = flags.has('--force');
const dryRun = flags.has('--dry-run');

const MODEL = process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts';
const VOICE = process.env.OPENAI_TTS_VOICE || 'alloy';
const MAX_CHARS_PER_CHUNK = Number(process.env.OPENAI_TTS_MAX_CHARS || 3500);
const INSTRUCTIONS =
  process.env.OPENAI_TTS_INSTRUCTIONS ||
  'Habla en castellano de España (es-ES), con dicción natural, cercana y serena.';
const RESPONSE_FORMAT = process.env.OPENAI_TTS_RESPONSE_FORMAT || 'mp3';
const SPEED = Number(process.env.OPENAI_TTS_SPEED || 1);

function parseEnvFile(content) {
  const values = {};
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[match[1]] = value;
  }
  return values;
}

async function loadLocalEnv() {
  const candidates = ['.env.local', '.env'];

  for (const filename of candidates) {
    const fullPath = path.join(ROOT, filename);
    const content = await fs.readFile(fullPath, 'utf8').catch(() => null);
    if (!content) continue;

    const parsed = parseEnvFile(content);
    for (const [key, value] of Object.entries(parsed)) {
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

function parseFrontMatter(content) {
  const match = content.match(FRONT_MATTER_RE);
  if (!match) {
    return { frontMatter: {}, body: content };
  }

  const frontMatter = {};
  for (const line of match[1].split('\n')) {
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;

    let value = pair[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    frontMatter[pair[1]] = value;
  }

  return { frontMatter, body: content.slice(match[0].length) };
}

async function walkMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkMarkdownFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && /\.(md|markdown)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function normalizeText(markdown) {
  return markdown
    .replace(/\[\^.+?\]:[\s\S]*?(?=\n\n|\n$|$)/g, ' ')
    .replace(/\[\^.+?\]/g, ' ')
    .replace(/\{\%[\s\S]*?\%\}/g, ' ')
    .replace(/\{\{[\s\S]*?\}\}/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_~#>`]/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function splitText(text, maxChars) {
  if (text.length <= maxChars) return [text];

  const chunks = [];
  let cursor = 0;
  while (cursor < text.length) {
    let end = Math.min(cursor + maxChars, text.length);
    if (end < text.length) {
      const punctuationBreak = Math.max(
        text.lastIndexOf('. ', end),
        text.lastIndexOf('? ', end),
        text.lastIndexOf('! ', end),
        text.lastIndexOf('; ', end)
      );
      const spaceBreak = text.lastIndexOf(' ', end);
      const breakAt =
        punctuationBreak > cursor + Math.floor(maxChars * 0.5)
          ? punctuationBreak + 1
          : spaceBreak;
      if (breakAt > cursor + Math.floor(maxChars * 0.6)) {
        end = breakAt;
      }
    }

    const chunk = text.slice(cursor, end).trim();
    if (chunk) chunks.push(chunk);
    cursor = end;
  }

  return chunks;
}

function getOutputPath(contentFile) {
  for (const dir of CONTENT_DIRS) {
    const baseDir = path.join(ROOT, dir) + path.sep;
    if (contentFile.startsWith(baseDir)) {
      const relative = path.relative(path.join(ROOT, dir), contentFile);
      const outputRelative = relative.replace(/\.(md|markdown)$/i, '.mp3');
      return path.join(AUDIO_DIR, outputRelative);
    }
  }

  throw new Error(`Ruta no soportada: ${contentFile}`);
}

async function fetchSpeechChunk(inputText) {
  const payload = {
    model: MODEL,
    voice: VOICE,
    input: inputText,
    response_format: RESPONSE_FORMAT,
    speed: SPEED
  };

  if (INSTRUCTIONS && MODEL.startsWith('gpt-4o')) {
    payload.instructions = INSTRUCTIONS;
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI TTS error (${response.status}): ${errorText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function resolveTargets() {
  if (targets.length === 0) {
    const files = [];
    for (const dir of CONTENT_DIRS) {
      const absDir = path.join(ROOT, dir);
      files.push(...(await walkMarkdownFiles(absDir)));
    }
    return files;
  }

  const resolved = [];
  for (const target of targets) {
    const absTarget = path.resolve(ROOT, target);
    const stat = await fs.stat(absTarget).catch(() => null);

    if (!stat) {
      throw new Error(`No existe la ruta indicada: ${target}`);
    }

    if (stat.isDirectory()) {
      resolved.push(...(await walkMarkdownFiles(absTarget)));
      continue;
    }

    resolved.push(absTarget);
  }

  return [...new Set(resolved)].sort();
}

async function generateOne(contentFile) {
  const raw = await fs.readFile(contentFile, 'utf8');
  const { frontMatter, body } = parseFrontMatter(raw);

  if (frontMatter.audio === false) {
    console.log(`- omitido (audio: false): ${contentFile}`);
    return;
  }

  const text = normalizeText(body);
  if (!text) {
    console.log(`- sin texto utilizable: ${contentFile}`);
    return;
  }

  const outputPath = getOutputPath(contentFile);
  if (!force) {
    const exists = await fs.access(outputPath).then(() => true).catch(() => false);
    if (exists) {
      console.log(`- ya existe: ${outputPath}`);
      return;
    }
  }

  const chunks = splitText(text, MAX_CHARS_PER_CHUNK);
  console.log(`- generando: ${path.relative(ROOT, contentFile)} (${chunks.length} fragmento(s))`);

  if (dryRun) return;

  const buffers = [];
  for (let i = 0; i < chunks.length; i += 1) {
    process.stdout.write(`  > fragmento ${i + 1}/${chunks.length}\r`);
    buffers.push(await fetchSpeechChunk(chunks[i]));
  }
  process.stdout.write('\n');

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, Buffer.concat(buffers));
  console.log(`  guardado: ${path.relative(ROOT, outputPath)}`);
}

async function main() {
  await loadLocalEnv();

  if (!dryRun && !process.env.OPENAI_API_KEY) {
    console.error('Falta OPENAI_API_KEY en el entorno o en .env.local.');
    process.exit(1);
  }

  const files = await resolveTargets();

  if (files.length === 0) {
    console.log('No se encontraron archivos markdown para procesar.');
    return;
  }

  console.log(`Archivos detectados: ${files.length}`);
  for (const file of files) {
    try {
      await generateOne(file);
    } catch (error) {
      console.error(`  error en ${path.relative(ROOT, file)}: ${error.message}`);
    }
  }

  console.log('Proceso terminado.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
