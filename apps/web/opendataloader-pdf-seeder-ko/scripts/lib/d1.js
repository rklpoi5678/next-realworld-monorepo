const CF_API_BASE = 'https://api.cloudflare.com/client/v4';

/**
 * Execute SQL against D1 via Cloudflare REST API.
 * @param {string} sql - SQL statement
 * @returns {Promise<object>} API response
 */
async function d1Query(sql) {
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
    body: JSON.stringify({ sql }),
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
 * Batches 100 rows per request (SQLite compound SELECT limit).
 * @param {Array<{name: string, standard: string, defects: string, remark: string, r2ImageUrl: string, part: string}>} items
 */
export async function bulkInsert(items) {
  if (items.length === 0) {
    console.log('No items to insert.');
    return;
  }

  const BATCH_SIZE = 100;
  let inserted = 0;

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const values = batch.map(item => {
      const name = escapeSQL(item.name);
      const standard = escapeSQL(item.standard);
      const defects = escapeSQL(item.defects || '');
      const remark = escapeSQL(item.remark || '');
      const r2ImageUrl = escapeSQL(item.r2ImageUrl || '');
      const part = escapeSQL(item.part);
      return `('${name}', '${standard}', '${defects}', '${remark}', '${r2ImageUrl}', '${part}')`;
    }).join(', ');

    const sql = `INSERT INTO inspection_rules (name, standard, defects, remark, r2_image_url, part) VALUES ${values}`;

    console.log(`Inserting batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} rows)...`);
    const result = await d1Query(sql);
    console.log(`  Result: ${result.result?.[0]?.meta?.rows_written || 'OK'}`);
    inserted += batch.length;
  }

  console.log(`Total inserted: ${inserted} rows`);
}

/**
 * Escape single quotes for SQL string literals.
 */
function escapeSQL(str) {
  return str.replace(/'/g, "''");
}
