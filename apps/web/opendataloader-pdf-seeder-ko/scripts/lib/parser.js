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
 * Extract table rows matching 파트|상품명|...|허용기준|Remark columns.
 * opendataloader JSON structure: doc.kids[] (flat list of pages/tables/images)
 */
function extractTableRows(doc, part) {
  const items = [];

  const kids = doc.kids;
  if (!kids) {
    console.warn('No kids found in PDF output');
    return items;
  }

  currentKids = kids; // Set for image lookup in parseTable

  for (const kid of kids) {
    if (kid.type === 'table') {
      const rows = parseTable(kid, part);
      items.push(...rows);
    }
  }

  // Fallback: parse paragraph/list kids as table rows
  if (items.length === 0) {
    const rows = parseKidsAsRows(kids, part);
    items.push(...rows);
  }

  return items;
}

/**
 * Parse structured table data from opendataloader output.
 * B-Mart inspection tables have fixed format:
 * Row 0: headers (파트|상품명|중량 & 사이즈|외박스|Packing type|허용기준|Remark)
 * Row 1: sub-headers (판매단위|개별|Type|입수(ea))
 * Row 2: product info (신선|name|weight|count|box_type|standard|remark)
 * Row 3: defects (성상 label in col 2| 부적합사항 in col 8| defects text in col 9| Remark)
 * Row 4: image labels
 * Row 5: empty
 */
function parseTable(table, part) {
  const items = [];
  if (!table.rows || table.rows.length < 3) return items;

  const headers = table.rows[0].cells.map(cell => {
    const kids = cell.kids || [];
    return kids.map(k => (k.content || '').trim()).join(' ');
  });

  // Only parse inspection tables (7-column format)
  if (!headers.includes('상품명')) return items;

  const pageNum = table['page number'] || 0;

  // Extract from row 2 (product info)
  const r2 = table.rows[2].cells;
  const name = cellText(r2[1]);   // column 1 = 상품명
  const standard = cellText(r2[headers.indexOf('허용기준')]); // column 5 = 허용기준
  const remark = cellText(r2[headers.indexOf('Remark')]);     // column 6 = Remark

  if (!name || name.trim() === '') return items;

  // Extract defects from row 3
  // Defects text can be in any cell after column 4 (skip the part/product columns).
  // Strategy: collect ALL non-label text from row 3 cells with column number > 4.
  let defects = '';
  const skipLabels = new Set(['성상', '부적합사항', '부적합', 'Remark', '제품전/후면', '박스 / 적재', '판매단위', '개별', 'Type', '입수(ea)', 'Packing type', '중량 & 사이즈', '외박스']);
  if (table.rows.length > 3) {
    for (const cell of table.rows[3].cells) {
      const colNum = cell['column number'] || 0;
      if (colNum <= 4) continue; // Skip part/product columns
      if (!cell.kids) continue;
      for (const kid of cell.kids) {
        const txt = (kid.content || '').trim();
        if (txt && !skipLabels.has(txt)) {
          defects += (defects ? ' ' : '') + txt;
        }
      }
    }
  }

  // Clean up defects (remove "Remark" suffix if present)
  defects = defects.replace(/^Remark\s*/i, '').trim();

  // Get images for this page
  const pageImages = getPageImages(pageNum);

  items.push({
    name,
    standard,
    defects,
    remark,
    localImagePath: pageImages.length > 0 ? `./images/${path.basename(pageImages[0])}` : '',
    part,
  });

  return items;
}

/**
 * Get images for a specific page number.
 */
function getPageImages(pageNum) {
  const imgs = [];
  for (const kid of currentKids) {
    if (kid.type === 'image' && kid['page number'] === pageNum) {
      imgs.push(kid.source || kid.path || '');
    }
  }
  return imgs.filter(Boolean);
}

let currentKids = []; // Module-level state for image lookup

/**
 * Fallback: parse paragraph/list kids as table rows when no structured table found.
 */
function parseKidsAsRows(kids, part) {
  const items = [];
  for (const kid of kids) {
    if (kid.type === 'paragraph' || kid.type === 'list') {
      const text = (kid.content || '').trim();
      if (!text) continue;
      const fields = text.split(/\t| {2,}/);
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
  }
  return items;
}

function cellText(cell) {
  if (!cell) return '';
  const kids = cell.kids || [];
  return kids.map(k => (k.content || '').trim()).join(' ');
}
