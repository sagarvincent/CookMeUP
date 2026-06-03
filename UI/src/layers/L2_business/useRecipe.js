import { useState, useMemo } from 'react';
import { scaleRecipe } from '../L3_composite/recipeScaling.js';
import { generateStepAnnotations } from '../L3_composite/recipeScaling.js';
import { crosscheckIngredients } from '../L3_composite/inventoryOps.js';

// ─────────────────────── useRecipe ─────────────── START ──────────────────
// calls:     L3/recipeScaling: scaleRecipe, generateStepAnnotations
//            L3/inventoryOps: crosscheckIngredients
// called by: components/screens/RecipeScreen
export function useRecipe({ recipe, inventory }) {
  const [kcal,     setKcal]     = useState(recipe.macros.kcal);
  const [oil,      setOil]      = useState(recipe.oil);
  const [spice,    setSpice]    = useState(recipe.spice);
  const [servings, setServings] = useState(recipe.servings);

  const { ings: scaledIngs, macros: scaledMacros } = useMemo(
    () => scaleRecipe(recipe, kcal, oil, spice),
    [recipe, kcal, oil, spice]
  );

  const inventoryChecks = useMemo(
    () => crosscheckIngredients(scaledIngs, inventory),
    [scaledIngs, inventory]
  );

  const stepAnnotations = useMemo(
    () => generateStepAnnotations(recipe.steps, { spiceLvl: spice, oilLvl: oil, kcalScale: kcal / recipe.macros.kcal }),
    [recipe.steps, spice, oil, kcal, recipe.macros.kcal]
  );

  return {
    kcal, setKcal,
    oil, setOil,
    spice, setSpice,
    servings, setServings,
    scaledIngs,
    scaledMacros,
    inventoryChecks,
    stepAnnotations,
  };
}
// ─────────────────────── useRecipe ─────────────── END ────────────────────
