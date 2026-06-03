// ─────────────────────── roundTo ─────────────── START ──────────────────
// calls:     none
// called by: L4/mathUtils: scaledValue, blendedFat
//            L3/recipeScaling: scaleIngredients
export function roundTo(n, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
}
// ─────────────────────── roundTo ─────────────── END ────────────────────

// ─────────────────────── clamp ─────────────── START ──────────────────
// calls:     none
// called by: L3/recipeScaling: scaleIngredients, L2/useRecipe
export function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}
// ─────────────────────── clamp ─────────────── END ────────────────────

// ─────────────────────── scaledValue ─────────────── START ──────────────────
// calls:     L4/mathUtils: roundTo
// called by: L3/recipeScaling: scaleMacros
export function scaledValue(v, ratio) {
  return roundTo(v * ratio, 0);
}
// ─────────────────────── scaledValue ─────────────── END ────────────────────

// ─────────────────────── blendedFat ─────────────── START ──────────────────
// calls:     L4/mathUtils: roundTo
// called by: L3/recipeScaling: scaleMacros
export function blendedFat(fat, ratio, oilRatio) {
  return roundTo(fat * (oilRatio * 0.6 + ratio * 0.4), 0);
}
// ─────────────────────── blendedFat ─────────────── END ────────────────────

// ─────────────────────── sumMacroKey ─────────────── START ──────────────────
// calls:     none
// called by: L3/dietPlanOps: dayTotals
export function sumMacroKey(macrosList, key) {
  return macrosList.reduce((acc, m) => acc + (m[key] || 0), 0);
}
// ─────────────────────── sumMacroKey ─────────────── END ────────────────────
