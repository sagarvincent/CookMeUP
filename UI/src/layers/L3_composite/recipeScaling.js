import { isOilIngredient } from '../L4_primitives/recipeUtils.js';
import { roundTo, scaledValue, blendedFat } from '../L4_primitives/mathUtils.js';

// ─────────────────────── scaleIngredients ─────────────── START ──────────────────
// calls:     L4/recipeUtils: isOilIngredient
//            L4/mathUtils: roundTo
// called by: L3/recipeScaling: scaleRecipe
export function scaleIngredients(ingredients, ratio, oilRatio) {
  return ingredients.map(i => ({
    ...i,
    qty: roundTo(isOilIngredient(i.name) ? i.qty * oilRatio : i.qty * ratio, 2),
  }));
}
// ─────────────────────── scaleIngredients ─────────────── END ────────────────────

// ─────────────────────── scaleMacros ─────────────── START ──────────────────
// calls:     L4/mathUtils: scaledValue, blendedFat
// called by: L3/recipeScaling: scaleRecipe
export function scaleMacros(macros, ratio, oilRatio) {
  return {
    kcal:    scaledValue(macros.kcal,    ratio),
    protein: scaledValue(macros.protein, ratio),
    carbs:   scaledValue(macros.carbs,   ratio),
    fat:     blendedFat(macros.fat, ratio, oilRatio),
    fiber:   scaledValue(macros.fiber,   ratio),
  };
}
// ─────────────────────── scaleMacros ─────────────── END ────────────────────

// ─────────────────────── scaleRecipe ─────────────── START ──────────────────
// calls:     L3/recipeScaling: scaleIngredients, scaleMacros
// called by: L2/useRecipe: scaledIngs + scaledMacros useMemo
export function scaleRecipe(recipe, kcalTarget, oilLvl, spiceLvl) {
  const ratio    = kcalTarget / recipe.macros.kcal;
  const oilRatio = recipe.oil > 0 ? oilLvl / recipe.oil : 1;
  return {
    ings:   scaleIngredients(recipe.ingredients, ratio, oilRatio),
    macros: scaleMacros(recipe.macros, ratio, oilRatio),
  };
}
// ─────────────────────── scaleRecipe ─────────────── END ────────────────────

// ─────────────────────── generateStepAnnotations ─────────────── START ──────────────────
// calls:     none (pure conditional logic on step index + slider values)
// called by: L2/useRecipe: stepAnnotations useMemo
export function generateStepAnnotations(steps, { spiceLvl, oilLvl, kcalScale }) {
  return steps.map((s, i) => {
    if (i === 0 && spiceLvl < 4)  return 'Cut chili in half; deseed.';
    if (i === 0 && spiceLvl > 7)  return 'Add ½ tsp Kashmiri chili to marinade.';
    if (i === 1 && oilLvl < 4)    return `Reduce ghee to ${Math.round(oilLvl * 0.5)} tbsp; pan-toast instead of deep frying onions.`;
    if (i === 1 && oilLvl > 7)    return 'Use full ghee + 1 tbsp neutral oil for crispier birista.';
    if (i === 4 && kcalScale < 0.85) return 'Skip the extra ghee drizzle when layering.';
    return null;
  });
}
// ─────────────────────── generateStepAnnotations ─────────────── END ────────────────────
