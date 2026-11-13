CREATE TABLE IF NOT EXISTS commanders (
  id TEXT PRIMARY KEY,
  avatar TEXT NOT NULL DEFAULT 'blue' CHECK (avatar IN ('blue','purple','gold','green')),
  language TEXT NOT NULL DEFAULT 'ar' CHECK (language IN ('ar','en')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS commander_progress (
  commander_id TEXT PRIMARY KEY REFERENCES commanders(id) ON DELETE CASCADE,
  data_json TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_commanders_updated_at ON commanders(updated_at);
