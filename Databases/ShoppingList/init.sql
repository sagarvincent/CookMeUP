-- Shopping List service schema

-- Stores which items the user has ticked off for a given week.
-- The list itself is computed on-the-fly from diet plan + pantry;
-- only the check state needs to be persisted.
CREATE TABLE IF NOT EXISTS shopping_checks (
  user_id    TEXT    NOT NULL,
  week       TEXT    NOT NULL,
  ingredient TEXT    NOT NULL,  -- lowercase canonical name used as key
  checked    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, week, ingredient)
);

CREATE INDEX IF NOT EXISTS idx_checks_user_week ON shopping_checks (user_id, week);
