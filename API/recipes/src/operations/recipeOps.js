const { nanoid }    = require('nanoid');
const { db }        = require('../db/db');
const {
  buildWhereClause,
  buildOrderClause,
  parsePagination,
} = require('../utils/queryUtils');

// ----------------------- parseRow --------------------------------------- START
// calls:     JSON.parse
// called by: all query functions
//
// Deserialises JSON columns (macros, ingredients, steps) back to JS objects.
// ----------------------- parseRow --------------------------------------- END
function parseRow(row) {
  if (!row) return null;
  return {
    ...row,
    macros:      JSON.parse(row.macros),
    ingredients: JSON.parse(row.ingredients),
    steps:       JSON.parse(row.steps),
    featured:    row.featured === 1,
  };
}

// ----------------------- listRecipes ------------------------------------ START
// calls:     buildWhereClause, buildOrderClause, parsePagination (L4)
// called by: recipeService.listRecipes
//
// Returns { recipes, total, page, limit } with all JSON columns parsed.
// ----------------------- listRecipes ------------------------------------ END
function listRecipes(query) {
  const { where, params } = buildWhereClause(query);
  const order             = buildOrderClause(query.sort);
  const { page, limit, offset } = parsePagination(query);

  const total = db.prepare(`SELECT COUNT(*) AS n FROM recipes ${where}`).get(...params).n;

  const rows = db.prepare(
    `SELECT * FROM recipes ${where} ${order} LIMIT ? OFFSET ?`
  ).all(...params, limit, offset);

  return { recipes: rows.map(parseRow), total, page, limit };
}

// ----------------------- getRecipeById ---------------------------------- START
// calls:     parseRow
// called by: recipeService.getRecipe
// ----------------------- getRecipeById ---------------------------------- END
function getRecipeById(id) {
  return parseRow(db.prepare(`SELECT * FROM recipes WHERE id = ?`).get(id));
}

// ----------------------- getFeaturedRecipe ------------------------------ START
// calls:     parseRow
// called by: recipeService.getFeatured
// ----------------------- getFeaturedRecipe ------------------------------ END
function getFeaturedRecipe() {
  return parseRow(
    db.prepare(`SELECT * FROM recipes WHERE featured = 1 ORDER BY rating DESC LIMIT 1`).get()
  );
}

// ----------------------- getRandomRecipe -------------------------------- START
// calls:     buildWhereClause (L4)
// called by: recipeService.getRandom
//
// Returns one random recipe, optionally filtered by the same query params as
// listRecipes (cuisine, course, diet).
// ----------------------- getRandomRecipe -------------------------------- END
function getRandomRecipe(query) {
  const { where, params } = buildWhereClause(query);
  return parseRow(
    db.prepare(`SELECT * FROM recipes ${where} ORDER BY RANDOM() LIMIT 1`).get(...params)
  );
}

// ----------------------- insertRecipe ----------------------------------- START
// calls:     nanoid
// called by: recipeService.createRecipe
// ----------------------- insertRecipe ----------------------------------- END
function insertRecipe(sanitised) {
  const id  = sanitised.id ?? nanoid(8);
  const now = Math.floor(Date.now() / 1000);

  db.prepare(`
    INSERT INTO recipes
      (id, name, cuisine, course, diet, time, servings, difficulty,
       tagline, history, spice, oil, macros, ingredients, steps, featured,
       rating, ratings, likes, cooked, created_at, updated_at)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?,
       0, 0, 0, 0, ?, ?)
  `).run(
    id,
    sanitised.name, sanitised.cuisine, sanitised.course, sanitised.diet,
    sanitised.time, sanitised.servings, sanitised.difficulty,
    sanitised.tagline, sanitised.history, sanitised.spice, sanitised.oil,
    sanitised.macros, sanitised.ingredients, sanitised.steps, sanitised.featured,
    now, now
  );

  return getRecipeById(id);
}

// ----------------------- updateRecipe ----------------------------------- START
// calls:     (none — direct DB write)
// called by: recipeService.updateRecipe
// ----------------------- updateRecipe ----------------------------------- END
function updateRecipe(id, sanitised) {
  const now = Math.floor(Date.now() / 1000);

  const result = db.prepare(`
    UPDATE recipes SET
      name = ?, cuisine = ?, course = ?, diet = ?, time = ?,
      servings = ?, difficulty = ?, tagline = ?, history = ?,
      spice = ?, oil = ?, macros = ?, ingredients = ?, steps = ?,
      featured = ?, updated_at = ?
    WHERE id = ?
  `).run(
    sanitised.name, sanitised.cuisine, sanitised.course, sanitised.diet, sanitised.time,
    sanitised.servings, sanitised.difficulty, sanitised.tagline, sanitised.history,
    sanitised.spice, sanitised.oil, sanitised.macros, sanitised.ingredients, sanitised.steps,
    sanitised.featured, now,
    id
  );

  if (result.changes === 0) return null;
  return getRecipeById(id);
}

// ----------------------- deleteRecipe ----------------------------------- START
// calls:     (none — direct DB delete)
// called by: recipeService.deleteRecipe
// ----------------------- deleteRecipe ----------------------------------- END
function deleteRecipe(id) {
  return db.prepare(`DELETE FROM recipes WHERE id = ?`).run(id).changes > 0;
}

module.exports = {
  listRecipes,
  getRecipeById,
  getFeaturedRecipe,
  getRandomRecipe,
  insertRecipe,
  updateRecipe,
  deleteRecipe,
};
