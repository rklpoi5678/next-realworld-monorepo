const CF_API_BASE = 'https://api.cloudflare.com/client/v4';

async function d1Query(sql, params = []) {
  const accountId = process.env.CF_ACCOUNT_ID;
  const databaseId = process.env.CF_D1_DATABASE_ID;
  const token = process.env.CF_API_TOKEN;

  if (!accountId || !databaseId || !token) {
    throw new Error('Missing CF_ACCOUNT_ID, CF_D1_DATABASE_ID, or CF_API_TOKEN');
  }

  const url = `${CF_API_BASE}/accounts/${accountId}/d1/database/${databaseId}/query`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });

  const json = await res.json();

  if (!json.success) {
    const errors = json.errors?.map(e => e.message).join('; ') || 'Unknown error';
    throw new Error(`D1 query failed: ${errors}`);
  }

  return json;
}

/**
 * Bulk insert inspection rules into D1.
 * Uses parameterized queries per row to avoid SQL injection and special character issues.
 */
export async function bulkInsert(items) {
  if (items.length === 0) {
    console.log('No items to insert.');
    return;
  }

  let inserted = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const sql = `INSERT INTO inspection_rules (name, defects, r2_image_url, part) VALUES (?, ?, ?, ?)`;
    const params = [item.name, item.defects || '', item.r2ImageUrl || '', item.part];

    if ((i + 1) % 100 === 0 || i === items.length - 1) {
      console.log(`Inserting ${i + 1}/${items.length}...`);
    }

    await d1Query(sql, params);
    inserted++;
  }

  console.log(`Total inserted: ${inserted} rows`);
}
