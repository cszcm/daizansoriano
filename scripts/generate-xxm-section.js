const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'xxm');
const TARGET_DIR = path.join(ROOT, '_xinxinming');

const MANUAL_TITLES = {
  1: 'Ficha técnica',
  2: 'Dedicatoria'
};

function slugify(input) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function stripHtml(value) {
  return value.replace(/<[^>]*>/g, '').trim();
}

function normalizeTitle(value) {
  return value
    .replace(/[*_`]/g, '')
    .replace(/\[\]\(#.*?\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.:;,\s]+$/, '');
}

function deriveTitle(rawContent, order) {
  if (MANUAL_TITLES[order]) {
    return MANUAL_TITLES[order];
  }

  const headingMatch = rawContent.match(/^#{2,3}\s+(.+)$/m);
  if (headingMatch) {
    const title = normalizeTitle(stripHtml(headingMatch[1]));
    if (title) return title;
  }

  const htmlHeadingMatch = rawContent.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i);
  if (htmlHeadingMatch) {
    const title = normalizeTitle(stripHtml(htmlHeadingMatch[1]));
    if (title) return title;
  }

  const lines = rawContent.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed === ':::' || trimmed.startsWith(':::')) continue;
    if (/^<h1/i.test(trimmed)) continue;
    if (/^<br\s*\/?>$/i.test(trimmed)) continue;
    if (/^!\[.*\]\(.*\)\s*$/.test(trimmed)) continue;
    if (/^<img\b/i.test(trimmed)) continue;
    if (trimmed.startsWith('<div ') || trimmed === '</div>') continue;

    const plain = normalizeTitle(stripHtml(trimmed).replace(/^>+\s*/, ''));
    if (plain) {
      return plain.length > 80 ? `${plain.slice(0, 77).trim()}...` : plain;
    }
  }

  return `Sección ${String(order).padStart(2, '0')}`;
}

function cleanContent(rawContent) {
  const lines = rawContent.split(/\r?\n/);
  const out = [];
  let mode = 'normal';

  for (const line of lines) {
    const trimmed = line.trim();

    if (mode === 'skip_image_block') {
      if (trimmed === ':::') mode = 'normal';
      continue;
    }

    if (mode === 'skip_image_html_div') {
      if (trimmed === '</div>') mode = 'normal';
      continue;
    }

    if (mode === 'verse') {
      if (trimmed === ':::') {
        mode = 'normal';
        out.push('');
        continue;
      }
      const verseLine = stripHtml(line).trim();
      out.push(verseLine ? `> ${verseLine}` : '>');
      continue;
    }

    if (trimmed.startsWith('::: centered-image')) {
      mode = 'skip_image_block';
      continue;
    }

    if (trimmed.startsWith('<div class="centered-image">')) {
      mode = 'skip_image_html_div';
      continue;
    }

    if (trimmed.startsWith('::: verse')) {
      mode = 'verse';
      out.push('');
      continue;
    }

    if (trimmed === ':::' || trimmed.startsWith(':::')) {
      continue;
    }

    if (/^!\[.*\]\(.*\).*$/.test(trimmed)) {
      continue;
    }

    if (/^<img\b/i.test(trimmed)) {
      continue;
    }

    if (/^<h1/i.test(trimmed)) {
      continue;
    }

    if (/^<br\s*\/?>$/i.test(trimmed)) {
      continue;
    }

    if (trimmed.startsWith('<div class="alineado-centro">') || trimmed === '</div>') {
      continue;
    }

    out.push(line);
  }

  const compact = [];
  let previousBlank = true;
  for (const line of out) {
    const isBlank = line.trim() === '';
    if (isBlank && previousBlank) continue;
    compact.push(line);
    previousBlank = isBlank;
  }

  while (compact.length > 0 && compact[0].trim() === '') compact.shift();
  while (compact.length > 0 && compact[compact.length - 1].trim() === '') compact.pop();

  return compact.join('\n');
}

function listSourceFiles() {
  if (!fs.existsSync(SOURCE_DIR)) return [];
  return fs
    .readdirSync(SOURCE_DIR)
    .filter((name) => /^Section\d{4}\.md$/i.test(name))
    .sort((a, b) => a.localeCompare(b));
}

function toFrontMatterValue(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

function main() {
  const files = listSourceFiles();
  if (files.length === 0) {
    console.error('No se encontraron archivos SectionXXXX.md en xxm/');
    process.exit(1);
  }

  fs.mkdirSync(TARGET_DIR, { recursive: true });

  for (const entry of fs.readdirSync(TARGET_DIR)) {
    if (entry.endsWith('.md')) {
      fs.unlinkSync(path.join(TARGET_DIR, entry));
    }
  }

  for (const fileName of files) {
    const sourcePath = path.join(SOURCE_DIR, fileName);
    const rawContent = fs.readFileSync(sourcePath, 'utf8');
    const order = parseInt(fileName.replace(/\D/g, ''), 10);
    const title = deriveTitle(rawContent, order);
    const clean = cleanContent(rawContent);
    const slugBase = slugify(title) || `seccion-${String(order).padStart(2, '0')}`;
    const targetName = `${String(order).padStart(2, '0')}-${slugBase}.md`;
    const targetPath = path.join(TARGET_DIR, targetName);

    const frontMatter = [
      '---',
      `title: ${toFrontMatterValue(title)}`,
      `xxm_order: ${order}`,
      `source_file: ${toFrontMatterValue(fileName)}`,
      `permalink: /xin-xin-ming/${slugBase}/`,
      '---',
      ''
    ].join('\n');

    fs.writeFileSync(targetPath, `${frontMatter}${clean}\n`, 'utf8');
    console.log(`Generado: _xinxinming/${targetName}`);
  }
}

main();
