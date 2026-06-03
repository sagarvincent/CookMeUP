const VALID_DIETS       = new Set(['Veg', 'Non-Veg', 'Vegan', 'Gluten-free']);
const VALID_DIFFICULTIES = new Set(['Easy', 'Medium', 'Hard']);

// ----------------------- validateRecipeBody ----------------------------- START
// calls:     (none — pure validation)
// called by: recipeService.createRecipe, recipeService.updateRecipe
//
// Returns { valid: true } or { valid: false, error: string }.
// ----------------------- validateRecipeBody ----------------------------- END
function validateRecipeBody(body) {
  if (!body.name  || typeof body.name  !== 'string') return { valid: false, error: 'name is required' };
  if (!body.cuisine                                 ) return { valid: false, error: 'cuisine is required' };
  if (!body.course                                  ) return { valid: false, error: 'course is required' };
  if (!VALID_DIETS.has(body.diet)                   ) return { valid: false, error: `diet must be one of: ${[...VALID_DIETS].join(', ')}` };
  if (!Number.isFinite(body.time) || body.time <= 0 ) return { valid: false, error: 'time must be a positive number (minutes)' };
  if (body.difficulty && !VALID_DIFFICULTIES.has(body.difficulty)) return { valid: false, error: `difficulty must be one of: ${[...VALID_DIFFICULTIES].join(', ')}` };
  if (body.ingredients && !Array.isArray(body.ingredients)       ) return { valid: false, error: 'ingredients must be an array' };
  if (body.steps       && !Array.isArray(body.steps)             ) return { valid: false, error: 'steps must be an array' };
  return { valid: true };
}

// ----------------------- sanitiseRecipeBody ----------------------------- START
// calls:     (none — pure transformation)
// called by: recipeService.createRecipe, recipeService.updateRecipe
//
// Returns a safe, typed record ready for DB insertion.
// ----------------------- sanitiseRecipeBody ----------------------------- END
function sanitiseRecipeBody(body) {
  return {
    name:        body.name,
    cuisine:     body.cuisine,
    course:      body.course,
    diet:        body.diet,
    time:        Number(body.time),
    servings:    Number(body.servings ?? 2),
    difficulty:  body.difficulty ?? 'Medium',
    tagline:     body.tagline  ?? null,
    history:     body.history  ?? null,
    spice:       Number(body.spice ?? 5),
    oil:         Number(body.oil   ?? 5),
    macros:      JSON.stringify(body.macros      ?? {}),
    ingredients: JSON.stringify(body.ingredients ?? []),
    steps:       JSON.stringify(body.steps       ?? []),
    featured:    body.featured ? 1 : 0,
  };
}

module.exports = { validateRecipeBody, sanitiseRecipeBody };
