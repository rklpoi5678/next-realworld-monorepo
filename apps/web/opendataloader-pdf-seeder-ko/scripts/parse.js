import 'dotenv/config';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parsePDF } from './lib/parser.js';

const PDF_PATH = process.env.PDF_PATH || './검품기준서.pdf';
const PART = process.env.PART || 'fresh';
const OUTPUT = path.resolve('data/data.json');

async function main() {
  console.log(`Parsing PDF: ${PDF_PATH}`);
  console.log(`Part: ${PART}`);

  const items = await parsePDF(PDF_PATH, PART);

  if (items.length === 0) {
    console.warn('No items extracted. Check PDF structure.');
    process.exit(1);
  }

  await writeFile(OUTPUT, JSON.stringify(items, null, 2), 'utf-8');
  console.log(`Wrote ${items.length} items to ${OUTPUT}`);

  const withImages = items.filter(i => i.localImagePath).length;
  console.log(`Items with images: ${withImages}/${items.length}`);
}

main().catch(err => {
  console.error('Parse failed:', err);
  process.exit(1);
});
