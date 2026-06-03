import { daysUntil } from '../L4_primitives/inventoryUtils.js';

// ─────────────────────── crosscheckIngredients ─────────────── START ──────────────────
// calls:     none (pure array mapping against inventory list)
// called by: L2/useRecipe: inventoryChecks useMemo
export function crosscheckIngredients(scaledIngs, inventory) {
  return scaledIngs.map(ing => {
    const item  = inventory.find(x => x.name.toLowerCase() === ing.name.toLowerCase());
    const have  = item ? item.qty : 0;
    const short = Math.max(0, ing.qty - have);
    return { ...ing, have, short, ok: short <= 0 };
  });
}
// ─────────────────────── crosscheckIngredients ─────────────── END ────────────────────

// ─────────────────────── aggregateShoppingList ─────────────── START ──────────────────
// calls:     none
// called by: L2/useShoppingList: aggregated useMemo
export function aggregateShoppingList(recipes, inventory) {
  const map = {};
  recipes.forEach(rec => {
    if (!rec) return;
    rec.ingredients.forEach(ing => {
      const item  = inventory.find(x => x.name.toLowerCase() === ing.name.toLowerCase());
      const have  = item ? item.qty : 0;
      const short = Math.max(0, ing.qty - have);
      if (short > 0) {
        if (!map[ing.name]) map[ing.name] = { name: ing.name, unit: ing.unit, short: 0, used_in: [] };
        map[ing.name].short   += short;
        map[ing.name].used_in.push(rec.name);
      }
    });
  });
  return Object.values(map);
}
// ─────────────────────── aggregateShoppingList ─────────────── END ────────────────────

// ─────────────────────── computeInventoryStats ─────────────── START ──────────────────
// calls:     L4/inventoryUtils: daysUntil
// called by: L2/useInventory: stats derivation
export function computeInventoryStats(inventory) {
  const stocked       = inventory.filter(i => i.qty > 0).length;
  const out           = inventory.filter(i => i.qty === 0).length;
  const expiring      = inventory.filter(i => { const d = daysUntil(i.expires); return d >= 0 && d <= 7; }).length;
  const categoryCount = new Set(inventory.map(i => i.category)).size;
  return { stocked, out, expiring, categoryCount };
}
// ─────────────────────── computeInventoryStats ─────────────── END ────────────────────
