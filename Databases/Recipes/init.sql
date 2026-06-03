-- =============================================================================
-- Mise & Plate — Recipes Database Schema
-- Applied once by API/recipes/src/db/db.js on first boot.
-- Seed recipes are inserted programmatically from seed/recipeData.js.
-- =============================================================================

CREATE TABLE IF NOT EXISTS recipes (
  id          TEXT    PRIMARY KEY,
  name        TEXT    NOT NULL,
  cuisine     TEXT    NOT NULL,
  course      TEXT    NOT NULL,
  diet        TEXT    NOT NULL,
  time        INTEGER NOT NULL,
  servings    INTEGER NOT NULL DEFAULT 2,
  difficulty  TEXT    NOT NULL DEFAULT 'Medium',
  rating      REAL    NOT NULL DEFAULT 0,
  ratings     INTEGER NOT NULL DEFAULT 0,
  likes       INTEGER NOT NULL DEFAULT 0,
  cooked      INTEGER NOT NULL DEFAULT 0,
  tagline     TEXT,
  history     TEXT,
  spice       INTEGER NOT NULL DEFAULT 5,
  oil         INTEGER NOT NULL DEFAULT 5,
  macros      TEXT    NOT NULL DEFAULT '{}',  -- JSON: { kcal, protein, carbs, fat, fiber }
  ingredients TEXT    NOT NULL DEFAULT '[]',  -- JSON: [{ name, qty, unit }, ...]
  steps       TEXT    NOT NULL DEFAULT '[]',  -- JSON: [{ t, body, min }, ...]
  featured    INTEGER NOT NULL DEFAULT 0,     -- 1 = Editor's pick
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Indexes for common filter columns
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine    ON recipes(cuisine);
CREATE INDEX IF NOT EXISTS idx_recipes_course     ON recipes(course);
CREATE INDEX IF NOT EXISTS idx_recipes_diet       ON recipes(diet);
CREATE INDEX IF NOT EXISTS idx_recipes_rating     ON recipes(rating DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_featured   ON recipes(featured) WHERE featured = 1;

-- =============================================================================
-- Seed data inserted by API/recipes/src/db/db.js at boot.
-- =============================================================================
