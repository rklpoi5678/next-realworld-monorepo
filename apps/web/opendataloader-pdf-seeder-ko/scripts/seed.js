import 'dotenv/config';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { uploadAllImages } from './lib/r2.js';
import { bulkInsert } from './lib/d1.js';

const DATA_PATH = path.resolve('data/data.json');

async function main() {
  if (!existsSync(DATA_PATH)) {
    console.error('data.json not found. Run parse.js first.');
    process.exit(1);
  }

  // Step 1: Read data.json
  const raw = await readFile(DATA_PATH, 'utf-8');
  const items = JSON.parse(raw);
  console.log(`Loaded ${items.length} items from data.json`);

  // Step 2: Upload images to R2
  console.log('\n--- Uploading images to R2 ---');
  const urlMap = await uploadAllImages(items);
  console.log(`Uploaded ${urlMap.size} images to R2`);

  // Step 3: Replace localImagePath with r2ImageUrl
  for (const item of items) {
    if (item.localImagePath && urlMap.has(item.localImagePath)) {
      item.r2ImageUrl = urlMap.get(item.localImagePath);
    } else {
      item.r2ImageUrl = '';
    }
    delete item.localImagePath;
  }

  // Step 4: Bulk insert into D1
  console.log('\n--- Inserting into D1 ---');
  await bulkInsert(items);

  // Step 5: Write final JSON with R2 URLs
  const finalPath = path.resolve('data/data.final.json');
  await writeFile(finalPath, JSON.stringify(items, null, 2), 'utf-8');
  console.log(`\nFinal output written to ${finalPath}`);
  console.log('Done.');
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
