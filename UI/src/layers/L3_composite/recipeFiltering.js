import {
  matchesQuery, matchesCuisine, matchesCourse, matchesDiet,
  sortByRating, sortByTime, sortByMostCooked, sortByLowestKcal,
} from '../L4_primitives/recipeUtils.js';

const SORT_MAP = {
  rating: sortByRating,
  time:   sortByTime,
  cooked: sortByMostCooked,
  kcal:   sortByLowestKcal,
};

// ─────────────────────── filterRecipes ─────────────── START ──────────────────
// calls:     L4/recipeUtils: matchesQuery, matchesCuisine, matchesCourse, matchesDiet
// called by: L3/recipeFiltering: filterAndSortRecipes
//            L2/useHome: filtered computation
export function filterRecipes(recipes, { q = '', cuisine = '', course = '', diet = '' } = {}) {
  return recipes.filter(r =>
    matchesQuery(r, q) &&
    matchesCuisine(r, cuisine) &&
    matchesCourse(r, course) &&
    matchesDiet(r, diet)
  );
}
// ─────────────────────── filterRecipes ─────────────── END ────────────────────

// ─────────────────────── sortRecipes ─────────────── START ──────────────────
// calls:     L4/recipeUtils: sortByRating, sortByTime, sortByMostCooked, sortByLowestKcal
// called by: L3/recipeFiltering: filterAndSortRecipes
//            L2/useHome: filtered computation
export function sortRecipes(recipes, sortBy = 'rating') {
  const comparator = SORT_MAP[sortBy] ?? sortByRating;
  return [...recipes].sort(comparator);
}
// ─────────────────────── sortRecipes ─────────────── END ────────────────────

// ─────────────────────── filterAndSortRecipes ─────────────── START ──────────────────
// calls:     L3/recipeFiltering: filterRecipes, sortRecipes
// called by: L2/useHome: filtered useMemo
export function filterAndSortRecipes(recipes, filters, sortBy) {
  return sortRecipes(filterRecipes(recipes, filters), sortBy);
}
// ─────────────────────── filterAndSortRecipes ─────────────── END ────────────────────

// ─────────────────────── matchBestRecipe ─────────────── START ──────────────────
// calls:     L4/recipeUtils: matchesQuery
// called by: L2/useIntake: submit
export function matchBestRecipe(recipes, query) {
  if (!query) return recipes.find(r => r.id === 'biryani') ?? recipes[0];
  const lo = query.toLowerCase();
  return (
    recipes.find(r => r.name.toLowerCase().includes(lo)) ||
    recipes.find(r =>
      lo.split(/\s+/).some(t => t.length > 2 && r.name.toLowerCase().includes(t))
    ) ||
    recipes.find(r =>
      lo.split(/\s+/).some(t => t.length > 2 && r.ingredients.some(i => i.name.toLowerCase().includes(t)))
    ) ||
    recipes.find(r => r.id === 'biryani') ||
    recipes[0]
  );
}
// ─────────────────────── matchBestRecipe ─────────────── END ────────────────────
