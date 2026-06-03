// ─────────────────────── matchesQuery ─────────────── START ──────────────────
// calls:     none
// called by: L3/recipeFiltering: filterRecipes
export function matchesQuery(recipe, q) {
  if (!q) return true;
  const lo = q.toLowerCase();
  return (
    recipe.name.toLowerCase().includes(lo) ||
    recipe.ingredients.some(i => i.name.toLowerCase().includes(lo))
  );
}
// ─────────────────────── matchesQuery ─────────────── END ────────────────────

// ─────────────────────── matchesCuisine ─────────────── START ──────────────────
// calls:     none
// called by: L3/recipeFiltering: filterRecipes
export function matchesCuisine(recipe, cuisineId) {
  return !cuisineId || recipe.cuisine === cuisineId;
}
// ─────────────────────── matchesCuisine ─────────────── END ────────────────────

// ─────────────────────── matchesCourse ─────────────── START ──────────────────
// calls:     none
// called by: L3/recipeFiltering: filterRecipes
export function matchesCourse(recipe, course) {
  return !course || recipe.course === course;
}
// ─────────────────────── matchesCourse ─────────────── END ────────────────────

// ─────────────────────── matchesDiet ─────────────── START ──────────────────
// calls:     none
// called by: L3/recipeFiltering: filterRecipes
export function matchesDiet(recipe, diet) {
  return !diet || recipe.diet === diet;
}
// ─────────────────────── matchesDiet ─────────────── END ────────────────────

// ─────────────────────── sortByRating ─────────────── START ──────────────────
// calls:     none
// called by: L3/recipeFiltering: sortRecipes
export function sortByRating(a, b) {
  return b.rating - a.rating;
}
// ─────────────────────── sortByRating ─────────────── END ────────────────────

// ─────────────────────── sortByTime ─────────────── START ──────────────────
// calls:     none
// called by: L3/recipeFiltering: sortRecipes
export function sortByTime(a, b) {
  return a.time - b.time;
}
// ─────────────────────── sortByTime ─────────────── END ────────────────────

// ─────────────────────── sortByMostCooked ─────────────── START ──────────────────
// calls:     none
// called by: L3/recipeFiltering: sortRecipes
export function sortByMostCooked(a, b) {
  return b.cooked - a.cooked;
}
// ─────────────────────── sortByMostCooked ─────────────── END ────────────────────

// ─────────────────────── sortByLowestKcal ─────────────── START ──────────────────
// calls:     none
// called by: L3/recipeFiltering: sortRecipes
export function sortByLowestKcal(a, b) {
  return a.macros.kcal - b.macros.kcal;
}
// ─────────────────────── sortByLowestKcal ─────────────── END ────────────────────

// ─────────────────────── isOilIngredient ─────────────── START ──────────────────
// calls:     none
// called by: L3/recipeScaling: scaleIngredients
export function isOilIngredient(name) {
  return /oil|ghee|butter|lard/i.test(name);
}
// ─────────────────────── isOilIngredient ─────────────── END ────────────────────
