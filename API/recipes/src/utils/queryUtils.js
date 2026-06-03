const VALID_SORTS  = new Set(['rating', 'time', 'cooked', 'kcal', 'ratings']);
const DEFAULT_SORT = 'rating';
const MAX_LIMIT    = 100;

// ----------------------- buildWhereClause ------------------------------- START
// calls:     (none — pure SQL construction)
// called by: recipeOps.listRecipes
//
// Builds a parameterised WHERE clause from the query params object.
// Returns { where: string, params: any[] }.
// ----------------------- buildWhereClause ------------------------------- END
function buildWhereClause(filters) {
  const clauses = [];
  const params  = [];

  if (filters.q) {
    clauses.push(`(LOWER(name) LIKE ? OR LOWER(tagline) LIKE ?)`);
    const term = `%${filters.q.toLowerCase()}%`;
    params.push(term, term);
  }

  if (filters.cuisine) {
    clauses.push(`cuisine = ?`);
    params.push(filters.cuisine);
  }

  if (filters.course) {
    clauses.push(`course = ?`);
    params.push(filters.course);
  }

  if (filters.diet) {
    clauses.push(`diet = ?`);
    params.push(filters.diet);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  return { where, params };
}
// ----------------------- buildWhereClause ------------------------------- END (duplicate marker removed)

// ----------------------- buildOrderClause ------------------------------- START
// calls:     (none — pure string construction)
// called by: recipeOps.listRecipes
//
// Returns a safe ORDER BY clause string.  Falls back to DEFAULT_SORT if the
// requested sort key is not in VALID_SORTS.
// ----------------------- buildOrderClause ------------------------------- END
function buildOrderClause(sort) {
  const key = VALID_SORTS.has(sort) ? sort : DEFAULT_SORT;
  // kcal lives inside the macros JSON — use json_extract
  if (key === 'kcal') return `ORDER BY json_extract(macros, '$.kcal') ASC`;
  return `ORDER BY ${key} DESC`;
}

// ----------------------- parsePagination -------------------------------- START
// calls:     (none — pure computation)
// called by: recipeOps.listRecipes
// ----------------------- parsePagination -------------------------------- END
function parsePagination(query) {
  const page  = Math.max(1, parseInt(query.page  ?? '1',  10));
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit ?? '50', 10)));
  return { page, limit, offset: (page - 1) * limit };
}

module.exports = { buildWhereClause, buildOrderClause, parsePagination };
