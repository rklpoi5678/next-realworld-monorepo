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
 * Row 2: product info (신선|name|weight|count|box_type|...|...)
 * Row 3: defects (성상 label in col 2| 부적합사항 in col 8| defects text in col 9)
 * Row 4: image labels (제품전/후면 in col2| 박스/적재 in col5)
 * Row 5: images (col2=product, col5=box, col8=defect images)
 */
function parseTable(table, part) {
  const items = [];
  if (!table.rows || table.rows.length < 3) return items;

  const headers = table.rows[0].cells.map(cell => {
    const kids = cell.kids || [];
    return kids.map(k => (k.content || '').trim()).join(' ');
  });

  // Only parse inspection tables (must have 상품명 header)
  if (!headers.includes('상품명')) return items;

  // Extract from row 2 (product info)
  const r2 = table.rows[2].cells;
  const name = cellText(r2[1]); // column 1 = 상품명

  if (!name || name.trim() === '') return items;

  // Extract defects text from multiple possible locations:
  // - row 3 col 9 (pages 1-2)
  // - row 5 col 9 (most pages)
  // - row 5 col 5 (variant: page 3 etc.)
  let defects = '';
  const collectDefects = (cell) => {
    for (const kid of cell.kids || []) {
      const txt = (kid.content || '').trim();
      if (txt && txt !== 'Remark') {
        defects += (defects ? ' ' : '') + txt;
      }
    }
  };

  const tryCollect = (row, colNum) => {
    for (const cell of row.cells) {
      if ((cell['column number'] || 0) === colNum) collectDefects(cell);
    }
  };

  if (table.rows.length > 3) tryCollect(table.rows[3], 9);
  if (!defects && table.rows.length > 5) tryCollect(table.rows[5], 9);
  if (!defects && table.rows.length > 5) tryCollect(table.rows[5], 5);

  defects = defects.replace(/\s*Remark\s*$/, '').trim();

  // Get defect images from row 5, column 8 (부적합사항 column)
  const defectImages = getDefectImages(table);

  items.push({
    name,
    defects,
    localImagePath: defectImages.length > 0 ? `./images/${path.basename(defectImages[0])}` : '',
    part,
  });

  return items;
}

/**
 * Extract defect images from row 5.
 * Images are in the same column as the defect label in row 3 (not col2=성상).
 */
function getDefectImages(table) {
  const imgs = [];
  if (table.rows.length < 6) return imgs;

  // Find defect label column in row 3 (exclude col2 which is 성상/기준)
  let defectCol = 8; // default
  if (table.rows.length > 3) {
    for (const cell of table.rows[3].cells) {
      const colNum = cell['column number'] || 0;
      if (colNum === 2) continue;
      const txt = cellText(cell);
      if (txt && txt !== 'Remark') {
        defectCol = colNum;
        break;
      }
    }
  }

  for (const cell of table.rows[5].cells) {
    const colNum = cell['column number'] || 0;
    if (colNum !== defectCol) continue;
    for (const kid of cell.kids || []) {
      if (kid.type === 'image' && kid.source) {
        imgs.push(kid.source);
      }
    }
  }
  return imgs;
}


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
