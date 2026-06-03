// aggregateUtils.js — L4 pure functions for ingredient aggregation and shortfall math

// ----------------------- aggregateIngredients --------------------------- START
// called by: shoppingService
// Sums ingredient quantities across every filled slot in the plan.
// A recipe appearing in multiple slots contributes its quantities multiple times.
// Key: `${name.toLowerCase()}|${unit}` — only same-unit quantities are summed.
// Returns an array of { name, qty, unit }
// ----------------------- aggregateIngredients --------------------------- END
function aggregateIngredients(plan, recipeMap) {
  const totals = new Map();

  for (const meals of Object.values(plan)) {
    for (const recipeId of Object.values(meals)) {
      if (!recipeId) continue;
      const recipe = recipeMap.get(recipeId);
      if (!recipe) continue;

      for (const ing of (recipe.ingredients ?? [])) {
        if (!ing.name) continue;
        const key = `${ing.name.toLowerCase()}|${ing.unit ?? ''}`;
        if (totals.has(key)) {
          totals.get(key).qty += ing.qty ?? 0;
        } else {
          // Preserve the original-cased name from the first encounter
          totals.set(key, { name: ing.name, qty: ing.qty ?? 0, unit: ing.unit ?? '' });
        }
      }
    }
  }

  return [...totals.values()];
}

// ----------------------- computeShortfall ------------------------------- START
// called by: shoppingService
// For each aggregated ingredient, looks up the matching pantry item
// (case-insensitive name + exact unit match) and computes the shortfall.
// Also resolves the pantry category for display grouping.
// Returns only items where shortfallQty > 0 (things that need buying).
// ----------------------- computeShortfall ------------------------------- END
function computeShortfall(aggregated, pantryItems) {
  // Build a lookup: `${name.lower()}|${unit}` → { qty, category }
  const pantryMap = new Map();
  for (const item of pantryItems) {
    const key = `${item.name.toLowerCase()}|${item.unit ?? ''}`;
    pantryMap.set(key, { qty: item.qty ?? 0, category: item.category ?? null });
  }

  const results = [];
  for (const ing of aggregated) {
    const key      = `${ing.name.toLowerCase()}|${ing.unit ?? ''}`;
    const onHand   = pantryMap.get(key);
    const onHandQty   = onHand?.qty ?? 0;
    const shortfallQty = Math.max(0, ing.qty - onHandQty);

    if (shortfallQty > 0) {
      results.push({
        name:         ing.name,
        neededQty:    ing.qty,
        unit:         ing.unit,
        onHandQty,
        shortfallQty,
        category:     onHand?.category ?? null,
        checked:      false, // merged in by shoppingService
      });
    }
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = { aggregateIngredients, computeShortfall };
