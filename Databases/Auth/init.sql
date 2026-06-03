-- =============================================================================
-- Mise & Plate — Auth Database Schema
-- Applied once by API/auth/src/db/db.js on first boot.
-- Dummy user is seeded programmatically (password hashed at runtime).
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
  id            TEXT    PRIMARY KEY,              -- 'usr_' + 12 random chars (nanoid)
  email         TEXT    UNIQUE NOT NULL,
  password_hash TEXT    NOT NULL,
  name          TEXT,
  created_at    INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  token      TEXT    PRIMARY KEY,
  user_id    TEXT    NOT NULL,
  expires_at INTEGER NOT NULL,
  used       INTEGER NOT NULL DEFAULT 0           -- 0 = valid, 1 = rotated/revoked
);

CREATE INDEX IF NOT EXISTS idx_rt_user
  ON refresh_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_rt_used_expires
  ON refresh_tokens(used, expires_at);

-- =============================================================================
-- Dummy user (password: password123) — hash inserted by db.js seed function.
-- email: demo@mise-and-plate.com
-- =============================================================================
