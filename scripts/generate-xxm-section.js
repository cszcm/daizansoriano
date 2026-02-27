const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'xxm');
const TARGET_SECTIONS_DIR = path.join(ROOT, '_xinxinming');
const TARGET_VERSES_DIR = path.join(ROOT, '_xinxinming_versos');

const CHAPTER_START = 5;
const CHAPTER_END = 19;

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

function escapeDoubleQuotes(value) {
  return String(value).replace(/"/g, '\\"');
}

function compactBlankLines(lines) {
  const out = [];
  let previousBlank = true;

  for (const line of lines) {
    const isBlank = line.trim() === '';
    if (isBlank && previousBlank) continue;
    out.push(line);
    previousBlank = isBlank;
  }

  while (out.length > 0 && out[0].trim() === '') out.shift();
  while (out.length > 0 && out[out.length - 1].trim() === '') out.pop();

  return out;
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

  return `Seccion ${String(order).padStart(2, '0')}`;
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

  return compactBlankLines(out).join('\n');
}

function listSourceFiles() {
  if (!fs.existsSync(SOURCE_DIR)) return [];
  return fs
    .readdirSync(SOURCE_DIR)
    .filter((name) => /^Section\d{4}\.md$/i.test(name))
    .sort((a, b) => a.localeCompare(b));
}

function clearMarkdownFiles(dir) {
  fs.mkdirSync(dir, { recursive: true });
  for (const entry of fs.readdirSync(dir)) {
    if (entry.endsWith('.md')) {
      fs.unlinkSync(path.join(dir, entry));
    }
  }
}

function isAppendixOrder(order) {
  return order <= 4 || order >= 20;
}

function isChapterOrder(order) {
  return order >= CHAPTER_START && order <= CHAPTER_END;
}

function cleanCommentLines(lines) {
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

    if (trimmed.startsWith('::: centered-image')) {
      mode = 'skip_image_block';
      continue;
    }

    if (trimmed.startsWith('<div class=\"centered-image\">')) {
      mode = 'skip_image_html_div';
      continue;
    }

    if (trimmed === ':::') continue;
    if (trimmed.startsWith(':::')) continue;
    if (/^!\[.*\]\(.*\).*$/.test(trimmed)) continue;
    if (/^<img\b/i.test(trimmed)) continue;
    if (/^<h1/i.test(trimmed)) continue;
    if (/^<br\s*\/?>$/i.test(trimmed)) continue;
    if (trimmed.startsWith('<div class=\"alineado-centro\">') || trimmed === '</div>') continue;

    out.push(line);
  }

  return compactBlankLines(out).join('\n');
}

function extractVerseBlocksFromRaw(rawContent) {
  const lines = rawContent.split(/\r?\n/);
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (!trimmed.startsWith('::: verse')) {
      i += 1;
      continue;
    }

    i += 1;
    const verseLines = [];
    while (i < lines.length && lines[i].trim() !== ':::') {
      const text = stripHtml(lines[i]).trim();
      if (text) verseLines.push(text);
      i += 1;
    }

    if (i < lines.length && lines[i].trim() === ':::') {
      i += 1;
    }

    const commentLines = [];
    while (i < lines.length && !lines[i].trim().startsWith('::: verse')) {
      commentLines.push(lines[i]);
      i += 1;
    }

    if (verseLines.length > 0) {
      blocks.push({
        verseLines,
        comment: cleanCommentLines(commentLines)
      });
    }
  }

  return blocks;
}

function buildSectionFrontMatter({ title, order, sourceFile, permalink }) {
  return [
    '---',
    `title: "${escapeDoubleQuotes(title)}"`,
    `xxm_order: ${order}`,
    `source_file: "${escapeDoubleQuotes(sourceFile)}"`,
    `xxm_is_appendix: ${isAppendixOrder(order)}`,
    `xxm_is_chapter: ${isChapterOrder(order)}`,
    `permalink: ${permalink}`,
    '---',
    ''
  ].join('\n');
}

function buildVerseFrontMatter({ verseId, verseNo, chapterOrder, chapterTitle, verseText, permalink }) {
  return [
    '---',
    `title: "Verso ${verseId}"`,
    `verse_id: "${verseId}"`,
    `verse_no: ${verseNo}`,
    `chapter_order: ${chapterOrder}`,
    `chapter_title: "${escapeDoubleQuotes(chapterTitle)}"`,
    `verse_text: "${escapeDoubleQuotes(verseText)}"`,
    `permalink: ${permalink}`,
    '---',
    ''
  ].join('\n');
}

function main() {
  const files = listSourceFiles();
  if (files.length === 0) {
    console.error('No se encontraron archivos SectionXXXX.md en xxm/');
    process.exit(1);
  }

  clearMarkdownFiles(TARGET_SECTIONS_DIR);
  clearMarkdownFiles(TARGET_VERSES_DIR);

  const chapterBlocks = [];

  for (const fileName of files) {
    const sourcePath = path.join(SOURCE_DIR, fileName);
    const rawContent = fs.readFileSync(sourcePath, 'utf8');
    const order = parseInt(fileName.replace(/\D/g, ''), 10);
    const title = deriveTitle(rawContent, order);
    const clean = cleanContent(rawContent);
    const slugBase = slugify(title) || `seccion-${String(order).padStart(2, '0')}`;
    const targetName = `${String(order).padStart(2, '0')}-${slugBase}.md`;
    const targetPath = path.join(TARGET_SECTIONS_DIR, targetName);

    const sectionFrontMatter = buildSectionFrontMatter({
      title,
      order,
      sourceFile: fileName,
      permalink: `/xin-xin-ming/${slugBase}/`
    });

    fs.writeFileSync(targetPath, `${sectionFrontMatter}${clean}\n`, 'utf8');
    console.log(`Generado: _xinxinming/${targetName}`);

    if (isChapterOrder(order)) {
      chapterBlocks.push({
        order,
        chapterTitle: title,
        blocks: extractVerseBlocksFromRaw(rawContent)
      });
    }
  }

  chapterBlocks.sort((a, b) => a.order - b.order);

  let verseNo = 0;
  for (const chapter of chapterBlocks) {
    for (const block of chapter.blocks) {
      verseNo += 1;
      const verseId = String(verseNo).padStart(2, '0');
      const verseText = block.verseLines.join(' / ');
      const targetName = `${verseId}.md`;
      const targetPath = path.join(TARGET_VERSES_DIR, targetName);

      const verseFrontMatter = buildVerseFrontMatter({
        verseId,
        verseNo,
        chapterOrder: chapter.order,
        chapterTitle: chapter.chapterTitle,
        verseText,
        permalink: `/xin-xin-ming/verso/${verseId}/`
      });

      const verseQuote = block.verseLines.map((line) => `> ${line}`).join('\n');
      const comment = block.comment ? `\n\n${block.comment}` : '';
      fs.writeFileSync(targetPath, `${verseFrontMatter}${verseQuote}${comment}\n`, 'utf8');
      console.log(`Generado: _xinxinming_versos/${targetName}`);
    }
  }

  console.log('');
  console.log(`Capitulos procesados (5-19): ${chapterBlocks.length}`);
  console.log(`Versos generados: ${verseNo}`);
  if (verseNo !== 73) {
    console.warn('Aviso: el numero de versos generados no es 73. Revisa el formato fuente.');
  }
}

main();
