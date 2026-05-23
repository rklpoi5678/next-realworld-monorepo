import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

function getR2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: process.env.CF_R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CF_R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.CF_R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });
}

/**
 * Upload a single file to R2.
 * @param {string} localPath - Local file path
 * @param {string} key - R2 object key
 * @returns {Promise<string>} Public URL of uploaded file
 */
export async function uploadToR2(localPath, key) {
  if (!existsSync(localPath)) {
    throw new Error(`File not found: ${localPath}`);
  }

  const client = getR2Client();
  const bucket = process.env.CF_R2_BUCKET_NAME;
  const publicUrl = process.env.CF_R2_PUBLIC_URL;

  if (!bucket) throw new Error('CF_R2_BUCKET_NAME not set');
  if (!publicUrl) throw new Error('CF_R2_PUBLIC_URL not set');

  const body = await readFile(localPath);

  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: getContentType(localPath),
  }));

  return `${publicUrl.replace(/\/$/, '')}/${key}`;
}

/**
 * Upload all images referenced in items array.
 * @param {Array<{localImagePath: string, name: string}>} items
 * @returns {Promise<Map<string, string>>} Map of localPath → R2 URL
 */
export async function uploadAllImages(items) {
  const urlMap = new Map();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.localImagePath) continue;

    const localPath = path.resolve(item.localImagePath);
    if (!existsSync(localPath)) {
      console.warn(`Image not found, skipping: ${localPath}`);
      continue;
    }

    const ext = path.extname(localPath);
    const key = `inspection-images/${sanitizeKey(item.name)}_${i}${ext}`;

    console.log(`Uploading [${i + 1}/${items.length}]: ${key}`);
    const url = await uploadToR2(localPath, key);
    urlMap.set(item.localImagePath, url);
  }

  return urlMap;
}

function sanitizeKey(name) {
  return name
    .replace(/[^a-zA-Z0-9가-힣_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 100);
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  };
  return types[ext] || 'application/octet-stream';
}
