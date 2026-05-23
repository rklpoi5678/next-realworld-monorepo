-- Create inspection_rules table in bmark-accounts D1 database
-- Run: wrangler d1 execute bmark-accounts --file=scripts/migrations/001_inspection_rules.sql

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

CREATE INDEX IF NOT EXISTS idx_inspection_rules_part ON inspection_rules(part);
CREATE INDEX IF NOT EXISTS idx_inspection_rules_name ON inspection_rules(name);
