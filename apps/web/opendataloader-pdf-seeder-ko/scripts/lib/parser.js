import { convert } from '@opendataloader/pdf';
import { mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.resolve('data');
const IMAGES_DIR = path.resolve('data/images');

/**
 * Parse PDF inspection criteria document.
 * @param {string} pdfPath - Path to PDF file
 * @param {string} part - 'fresh' or 'frozen'
 * @returns {Promise<Array<{name: string, standard: string, defects: string, remark: string, localImagePath: string, part: string}>>}
 */
export async function parsePDF(pdfPath, part = 'fresh') {
  if (!existsSync(pdfPath)) {
    throw new Error(`PDF not found: ${pdfPath}`);
  }

  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(IMAGES_DIR, { recursive: true });

  const outputDir = path.resolve('data/.opendataloader-tmp');
  await mkdir(outputDir, { recursive: true });

  // Step 1: Convert PDF to JSON + extract images
  await convert([pdfPath], {
    outputDir,
    format: 'json',
    imageOutput: 'external',
    imageFormat: 'jpeg',
    imageDir: IMAGES_DIR,
    quiet: true,
  });

  // Step 2: Read the generated JSON output
  const pdfBaseName = path.basename(pdfPath, '.pdf');
  const jsonPath = path.join(outputDir, `${pdfBaseName}.json`);

  if (!existsSync(jsonPath)) {
    throw new Error(`opendataloader did not produce JSON output at ${jsonPath}`);
  }

  const raw = await readFile(jsonPath, 'utf-8');
  const doc = JSON.parse(raw);

  // Step 3: Extract table rows from JSON structure
  const items = extractTableRows(doc, part);

  return items;
}

/**
 * Extract table rows matching 상품명/허용기준/부적합사항/Remark columns.
 * opendataloader JSON structure: doc.pages[].blocks[] or doc.pages[].tables[]
 */
function extractTableRows(doc, part) {
  const items = [];

  if (!doc.pages) {
    console.warn('No pages found in PDF output');
    return items;
  }

  for (const page of doc.pages) {
    // Try structured tables first
    if (page.tables) {
      for (const table of page.tables) {
        const rows = parseTable(table, part);
        items.push(...rows);
      }
    }

    // Fallback: parse text blocks as table rows
    if (items.length === 0 && page.blocks) {
      const rows = parseBlocksAsTable(page.blocks, part);
      items.push(...rows);
    }
  }

  // Map images to items by page proximity
  mapImagesToItems(doc, items);

  return items;
}

/**
 * Parse structured table data from opendataloader output.
 * Assumes first row is header with 상품명/허용기준/부적합사항/Remark columns.
 */
function parseTable(table, part) {
  const items = [];
  if (!table.rows || table.rows.length < 2) return items;

  const headers = table.rows[0].map(cell => (cell.text || '').trim());

  // Find column indices
  const nameIdx = headers.findIndex(h => h.includes('상품명') || h.includes('품명') || h.includes('품목'));
  const standardIdx = headers.findIndex(h => h.includes('허용기준') || h.includes('기준'));
  const defectsIdx = headers.findIndex(h => h.includes('부적합') || h.includes('불용'));
  const remarkIdx = headers.findIndex(h => h.includes('Remark') || h.includes('비고'));

  if (nameIdx === -1) return items; // Not a valid inspection table

  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    const name = cellText(row[nameIdx]);
    if (!name) continue;

    items.push({
      name,
      standard: cellText(row[standardIdx]),
      defects: cellText(row[defectsIdx]),
      remark: cellText(row[remarkIdx]),
      localImagePath: '',
      part,
    });
  }

  return items;
}

/**
 * Fallback: parse text blocks as table rows when no structured table found.
 */
function parseBlocksAsTable(blocks, part) {
  const items = [];
  const textBlocks = blocks
    .filter(b => b.text && b.text.trim())
    .map(b => b.text.trim());

  // Heuristic: blocks that look like table rows (contain multiple tab-separated or spaced fields)
  for (const block of textBlocks) {
    const fields = block.split(/\t| {2,}/);
    if (fields.length >= 3) {
      items.push({
        name: fields[0] || '',
        standard: fields[1] || '',
        defects: fields[2] || '',
        remark: fields[3] || '',
        localImagePath: '',
        part,
      });
    }
  }

  return items;
}

function cellText(cell) {
  if (!cell) return '';
  return (cell.text || '').trim();
}

/**
 * Map extracted images to items by page proximity.
 * Images on the same page as an item are assigned to that item.
 */
function mapImagesToItems(doc, items) {
  if (!doc.pages) return;

  const imageFiles = [];
  for (const page of doc.pages) {
    if (page.images) {
      for (const img of page.images) {
        if (img.path) {
          imageFiles.push({
            page: page.pageNumber || 0,
            path: img.path,
          });
        }
      }
    }
  }

  if (imageFiles.length === 0) return;

  // Assign images to items on the same page (1:1 mapping by order)
  let imgIdx = 0;
  for (const item of items) {
    if (imgIdx < imageFiles.length) {
      const img = imageFiles[imgIdx];
      const filename = path.basename(img.path);
      item.localImagePath = `./images/${filename}`;
      imgIdx++;
    }
  }
}
