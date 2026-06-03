const Database = require('better-sqlite3');
const path     = require('path');
const fs       = require('fs');
const { RECIPES } = require('../../seed/recipeData');

// ----------------------- openDb ----------------------------------------- START
// calls:     better-sqlite3 Database constructor
// called by: module initialisation (runs once on require)
// ----------------------- openDb ----------------------------------------- END
function openDb() {
  const dbPath = process.env.RECIPES_DB_PATH
    ?? path.resolve(__dirname, '../../../data/recipes.db');

  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  const sql = fs.readFileSync(
    path.resolve(__dirname, '../../../../Databases/Recipes/init.sql'),
    'utf8'
  );
  db.exec(sql);
  return db;
}

const db = openDb();

// ----------------------- seedRecipes ------------------------------------ START
// calls:     db INSERT OR IGNORE
// called by: module initialisation (after schema is applied)
//
// Inserts all seed recipes if they don't already exist.  Idempotent.
// JSON columns (macros, ingredients, steps) are serialised here.
// ----------------------- seedRecipes ------------------------------------ END
function seedRecipes() {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO recipes
      (id, name, cuisine, course, diet, time, servings, difficulty,
       rating, ratings, likes, cooked, tagline, history,
       spice, oil, macros, ingredients, steps, featured, created_at, updated_at)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = Math.floor(Date.now() / 1000);
  let seeded = 0;

  const insertMany = db.transaction(() => {
    for (const r of RECIPES) {
      const changes = insert.run(
        r.id, r.name, r.cuisine, r.course, r.diet, r.time, r.servings, r.difficulty,
        r.rating, r.ratings, r.likes, r.cooked, r.tagline ?? null, r.history ?? null,
        r.spice, r.oil,
        JSON.stringify(r.macros),
        JSON.stringify(r.ingredients),
        JSON.stringify(r.steps),
        r.featured ?? 0,
        now, now
      );
      seeded += changes.changes;
    }
  });

  insertMany();
  if (seeded > 0) console.log(`[db] Seeded ${seeded} recipes`);
}

seedRecipes();

module.exports = { db };
