-- Diet Plan service schema

CREATE TABLE IF NOT EXISTS diet_plans (
  id         TEXT    NOT NULL,
  user_id    TEXT    NOT NULL,
  week       TEXT    NOT NULL,  -- ISO week e.g. "2026-W23"
  plan       TEXT    NOT NULL DEFAULT '{}',  -- JSON: { Mon: { Breakfast: id|null, … }, … }
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, week)
);

CREATE TABLE IF NOT EXISTS macro_targets (
  user_id    TEXT    PRIMARY KEY,
  preset     TEXT    NOT NULL DEFAULT 'Custom',
  kcal       INTEGER NOT NULL DEFAULT 2000,
  protein_g  REAL    NOT NULL DEFAULT 150,
  carbs_g    REAL    NOT NULL DEFAULT 200,
  fat_g      REAL    NOT NULL DEFAULT 70,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_plans_user ON diet_plans (user_id);
