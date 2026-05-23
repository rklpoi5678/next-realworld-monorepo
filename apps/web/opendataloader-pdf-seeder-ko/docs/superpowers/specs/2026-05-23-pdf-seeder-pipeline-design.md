# PDF Seeder Pipeline Design

## Context

B-Mark PWA (bmark-pwa) needs inspection criteria data (검품기준서) seeded into Cloudflare D1 + R2. Currently the data lives in PDF files with table structure: 상품명 / 허용기준 / 부적합사항 / Remark + embedded images. No automated extraction pipeline exists.

This tool is a **local Node.js data pipeline** — not a web app. The Vite + React scaffold in this directory is unused for now (future GUI wrapper).

## Architecture

```
검품기준서.pdf
     │
     ▼
┌─────────────┐     ┌──────────────┐
│  parse.js    │ ──▶ │  data.json   │
│ opendataloader│    │  images/     │
└─────────────┘     └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐     ┌──────────────┐
                    │   seed.js    │ ──▶ │  R2 Bucket   │
                    │ R2 API + D1  │     │  D1 Database │
                    │   REST API   │     └──────────────┘
                    └──────────────┘
```

Two independent scripts:
1. **parse.js** — PDF → `data.json` + `images/` directory
2. **seed.js** — `data.json` → R2 upload → D1 bulk insert via Cloudflare REST API

## Data Model

### Intermediate JSON (data.json)

```json
[
  {
    "name": "사과",
    "standard": "표면에 흠집이 없을 것",
    "defects": "압상, 찰과상, 병충해 흔적",
    "remark": "수입산은 별도 기준 적용",
    "localImagePath": "./images/item_001.jpg",
    "part": "fresh"
  }
]
```

### D1 Table Schema

```sql
CREATE TABLE IF NOT EXISTS inspection_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  standard TEXT NOT NULL,
  defects TEXT,
  remark TEXT,
  r2_image_url TEXT,
  part TEXT NOT NULL CHECK(part IN ('fresh', 'frozen')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
```

`part` column: `'fresh'` (신선) or `'frozen'` (축산).

## Script Details

### parse.js

1. Accept PDF path via CLI arg or `.env` config
2. Call `@opendataloader/pdf` `convert()` with `imageOutput: "external"`, `format: "json"`
3. Parse opendataloader JSON output — extract table rows matching 상품명/허용기준/부적합사항/Remark columns
4. Map extracted images to rows by page/position proximity
5. Copy images to `./images/` directory with sanitized filenames
6. Write `data.json`

### seed.js

1. Read `data.json`
2. For each item, upload `localImagePath` file to Cloudflare R2 via REST API (CF API token auth)
3. Replace `localImagePath` with `r2ImageUrl` (R2 public URL)
4. Generate SQL INSERT statements (batched, 100 rows per statement)
5. Execute SQL against D1 via Cloudflare REST API (`POST /accounts/{accountId}/d1/database/{databaseId}/query`)
6. Log results

### D1 Insert Strategy: Cloudflare REST API

Use Cloudflare REST API directly (no `wrangler` dependency):
- Endpoint: `POST https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/d1/database/{D1_DATABASE_ID}/query`
- Auth: `Authorization: Bearer {CF_API_TOKEN}`
- Body: `{ "sql": "INSERT INTO inspection_rules ..." }`
- Batch 100 rows per request (SQLite `max_compound_select` limit)

## Environment Variables (.env)

```bash
# Cloudflare
CF_ACCOUNT_ID=xxx
CF_API_TOKEN=xxx
CF_D1_DATABASE_ID=xxx

# R2
CF_R2_ACCESS_KEY_ID=xxx
CF_R2_SECRET_ACCESS_KEY=xxx
CF_R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
CF_R2_BUCKET_NAME=bmark-images
CF_R2_PUBLIC_URL=https://pub-xxx.r2.dev

# PDF Input
PDF_PATH=./검품기준서.pdf
```

## File Structure

```
opendataloader-pdf-seeder-ko/
├── scripts/
│   ├── parse.js              # PDF → data.json + images/
│   ├── seed.js               # data.json → R2 → D1
│   └── lib/
│       ├── parser.js         # opendataloader wrapper + table extraction
│       ├── r2.js             # R2 upload via S3-compatible API
│       └── d1.js             # D1 bulk insert via CF REST API
├── data/                     # Generated output (gitignored)
│   ├── data.json
│   └── images/
├── .env.example
├── .env                      # gitignored
└── package.json              # Updated with scripts + deps
```

## Dependencies

```json
{
  "@opendataloader/pdf": "^2.4.6",
  "@aws-sdk/client-s3": "^3.x",
  "dotenv": "^16.x"
}
```

## Verification

1. `node scripts/parse.js` — verify `data/data.json` exists with correct schema, `data/images/` has extracted files
2. `node scripts/seed.js` — verify R2 bucket has uploaded images, D1 table has rows
3. `wrangler d1 execute bmark-accounts --command "SELECT count(*) FROM inspection_rules"` — confirm row count
4. `wrangler d1 execute bmark-accounts --command "SELECT * FROM inspection_rules WHERE part='fresh' LIMIT 3"` — spot-check data
