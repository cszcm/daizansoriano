#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, '_posts');
const AUDIO_DIR = path.join(ROOT, 'audio');
const API_URL = 'https://api.openai.com/v1/audio/speech';

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const dryRun = args.has('--dry-run');

const MODEL = process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts';
const VOICE = process.env.OPENAI_TTS_VOICE || 'alloy';
const MAX_CHARS_PER_CHUNK = Number(process.env.OPENAI_TTS_MAX_CHARS || 3500);
const INSTRUCTIONS = process.env.OPENAI_TTS_INSTRUCTIONS || 'Habla en castellano de España (es-ES), con dicción natural y clara.';

if (!dryRun && !process.env.OPENAI_API_KEY) {
  console.error('Falta OPENAI_API_KEY en el entorno.');
  process.exit(1);
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
    if (/\.(md|markdown)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function extractFrontMatter(content) {
  if (!content.startsWith('---\n')) {
    return { frontMatter: {}, body: content };
  }

  const end = content.indexOf('\n---\n', 4);
  if (end === -1) {
    return { frontMatter: {}, body: content };
  }

  const raw = content.slice(4, end).trim();
  const body = content.slice(end + 5);
  const frontMatter = {};

  for (const line of raw.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    frontMatter[match[1]] = value;
  }

  return { frontMatter, body };
}

function markdownToPlainText(markdown) {
  return markdown
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
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function splitText(text, maxChars) {
  if (text.length <= maxChars) {
    return [text];
  }

  const chunks = [];
  let cursor = 0;

  while (cursor < text.length) {
    let end = Math.min(cursor + maxChars, text.length);
    if (end < text.length) {
      const breakAt = text.lastIndexOf(' ', end);
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

async function fetchSpeechChunk(inputText) {
  const payload = {
    model: MODEL,
    voice: VOICE,
    format: 'mp3',
    input: inputText
  };

  if (INSTRUCTIONS && /^gpt-4o/i.test(MODEL)) {
    payload.instructions = INSTRUCTIONS;
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI TTS error (${res.status}): ${errText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function getOutputPath(postFile) {
  const relative = path.relative(POSTS_DIR, postFile);
  const withoutExt = relative.replace(/\.(md|markdown)$/i, '');
  return path.join(AUDIO_DIR, `${withoutExt}.mp3`);
}

async function generateOne(postFile) {
  const raw = await fs.readFile(postFile, 'utf8');
  const { frontMatter, body } = extractFrontMatter(raw);

  if (frontMatter.audio === false) {
    console.log(`- omitido (audio: false): ${postFile}`);
    return;
  }

  const text = markdownToPlainText(body);
  if (!text) {
    console.log(`- sin texto: ${postFile}`);
    return;
  }

  const outputPath = getOutputPath(postFile);
  if (!force) {
    try {
      await fs.access(outputPath);
      console.log(`- ya existe: ${outputPath}`);
      return;
    } catch {
      // continue
    }
  }

  const chunks = splitText(text, MAX_CHARS_PER_CHUNK);
  console.log(`- generando: ${postFile} (${chunks.length} fragmento(s))`);

  if (dryRun) {
    return;
  }

  const buffers = [];
  for (let i = 0; i < chunks.length; i += 1) {
    process.stdout.write(`  > fragmento ${i + 1}/${chunks.length}\r`);
    const chunkBuffer = await fetchSpeechChunk(chunks[i]);
    buffers.push(chunkBuffer);
  }
  process.stdout.write('\n');

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, Buffer.concat(buffers));
  console.log(`  guardado: ${outputPath}`);
}

async function main() {
  await fs.mkdir(AUDIO_DIR, { recursive: true });
  const posts = await walkMarkdownFiles(POSTS_DIR);

  if (!posts.length) {
    console.log('No se encontraron posts markdown en _posts/.');
    return;
  }

  console.log(`Posts detectados: ${posts.length}`);
  for (const postFile of posts) {
    try {
      await generateOne(postFile);
    } catch (error) {
      console.error(`  error en ${postFile}:`, error.message);
    }
  }

  console.log('Proceso terminado.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
