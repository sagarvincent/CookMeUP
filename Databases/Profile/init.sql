-- =============================================================================
-- Mise & Plate — Profile Database Schema
-- Applied once by API/auth/src/db/db.js on first boot.
-- Dummy preferences row seeded programmatically for demo@mise-and-plate.com.
-- Note: user_id references users.id in the Auth DB (cross-DB, not FK-enforced).
-- =============================================================================

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id     TEXT    PRIMARY KEY,               -- references users.id in Auth DB
  diet        TEXT    NOT NULL DEFAULT 'Non-Veg',
  allergies   TEXT    NOT NULL DEFAULT '[]',     -- JSON array: ["Peanut", ...]
  skill       TEXT    NOT NULL DEFAULT 'Comfortable',
  target_kcal INTEGER NOT NULL DEFAULT 2100,
  spice       INTEGER NOT NULL DEFAULT 5,
  cuisines    TEXT    NOT NULL DEFAULT '[]',     -- JSON array: ["indian", "italian"]
  cook_freq   INTEGER NOT NULL DEFAULT 4,
  equipment   TEXT    NOT NULL DEFAULT '[]',     -- JSON array: ["Gas range", ...]
  updated_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

-- =============================================================================
-- Dummy preferences for demo user — inserted by db.js seed function.
-- user_id: usr_demo
-- =============================================================================
