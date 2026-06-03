const {
  validateRecipeBody,
  sanitiseRecipeBody,
} = require('../utils/validateUtils');
const {
  listRecipes,
  getRecipeById,
  getFeaturedRecipe,
  getRandomRecipe,
  insertRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../operations/recipeOps');

// ----------------------- listRecipesService ----------------------------- START
// calls:     listRecipes (L3)
// called by: recipeRoutes GET /recipes
// ----------------------- listRecipesService ----------------------------- END
async function listRecipesService(query) {
  return listRecipes(query);
}

// ----------------------- getRecipeService ------------------------------- START
// calls:     getRecipeById (L3)
// called by: recipeRoutes GET /recipes/:id
// ----------------------- getRecipeService ------------------------------- END
async function getRecipeService(id) {
  const recipe = getRecipeById(id);
  if (!recipe) throw Object.assign(new Error('Recipe not found'), { status: 404 });
  return recipe;
}

// ----------------------- getFeaturedService ----------------------------- START
// calls:     getFeaturedRecipe (L3)
// called by: recipeRoutes GET /recipes/featured
// ----------------------- getFeaturedService ----------------------------- END
async function getFeaturedService() {
  const recipe = getFeaturedRecipe();
  if (!recipe) throw Object.assign(new Error('No featured recipe set'), { status: 404 });
  return recipe;
}

// ----------------------- getRandomService ------------------------------- START
// calls:     getRandomRecipe (L3)
// called by: recipeRoutes GET /recipes/random
// ----------------------- getRandomService ------------------------------- END
async function getRandomService(query) {
  const recipe = getRandomRecipe(query);
  if (!recipe) throw Object.assign(new Error('No recipes match those filters'), { status: 404 });
  return recipe;
}

// ----------------------- createRecipeService ---------------------------- START
// calls:     validateRecipeBody, sanitiseRecipeBody (L4), insertRecipe (L3)
// called by: recipeRoutes POST /recipes (admin)
// ----------------------- createRecipeService ---------------------------- END
async function createRecipeService(body) {
  const { valid, error } = validateRecipeBody(body);
  if (!valid) throw Object.assign(new Error(error), { status: 400 });
  return insertRecipe(sanitiseRecipeBody(body));
}

// ----------------------- updateRecipeService ---------------------------- START
// calls:     validateRecipeBody, sanitiseRecipeBody (L4), updateRecipe (L3)
// called by: recipeRoutes PUT /recipes/:id (admin)
// ----------------------- updateRecipeService ---------------------------- END
async function updateRecipeService(id, body) {
  const { valid, error } = validateRecipeBody(body);
  if (!valid) throw Object.assign(new Error(error), { status: 400 });
  const updated = updateRecipe(id, sanitiseRecipeBody(body));
  if (!updated) throw Object.assign(new Error('Recipe not found'), { status: 404 });
  return updated;
}

// ----------------------- deleteRecipeService ---------------------------- START
// calls:     deleteRecipe (L3)
// called by: recipeRoutes DELETE /recipes/:id (admin)
// ----------------------- deleteRecipeService ---------------------------- END
async function deleteRecipeService(id) {
  const deleted = deleteRecipe(id);
  if (!deleted) throw Object.assign(new Error('Recipe not found'), { status: 404 });
}

module.exports = {
  listRecipesService,
  getRecipeService,
  getFeaturedService,
  getRandomService,
  createRecipeService,
  updateRecipeService,
  deleteRecipeService,
};
