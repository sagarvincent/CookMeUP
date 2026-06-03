-- =============================================================================
-- Mise & Plate — Pantry Database Schema
-- Applied once by API/pantry/src/db/db.js on first boot.
-- Demo items for usr_demo are seeded programmatically from seed/inventoryData.js.
-- =============================================================================

CREATE TABLE IF NOT EXISTS pantry_items (
  id         TEXT    PRIMARY KEY,               -- nanoid
  user_id    TEXT    NOT NULL,                  -- references users.id in Auth DB
  name       TEXT    NOT NULL,
  qty        REAL    NOT NULL DEFAULT 0,
  unit       TEXT    NOT NULL DEFAULT '',
  category   TEXT    NOT NULL DEFAULT 'Other',
  expires    TEXT,                              -- ISO date: YYYY-MM-DD or NULL
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_pantry_user
  ON pantry_items(user_id);

CREATE INDEX IF NOT EXISTS idx_pantry_user_name
  ON pantry_items(user_id, name COLLATE NOCASE);

CREATE INDEX IF NOT EXISTS idx_pantry_expires
  ON pantry_items(expires) WHERE expires IS NOT NULL;

-- =============================================================================
-- Demo items seeded by API/pantry/src/db/db.js for user usr_demo.
-- =============================================================================
