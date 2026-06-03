// ─────────────────────── daysUntil ─────────────── START ──────────────────
// calls:     none
// called by: L3/inventoryOps: crosscheckIngredients, computeInventoryStats
//            L2/useInventory: stats derivation
export function daysUntil(dateStr) {
  return Math.round((new Date(dateStr) - new Date()) / 86400000);
}
// ─────────────────────── daysUntil ─────────────── END ────────────────────

// ─────────────────────── stockPercent ─────────────── START ──────────────────
// calls:     none
// called by: L2/useInventory: filtered row render
export function stockPercent(qty) {
  return Math.min(100, Math.max(0, (qty / (qty + 2)) * 100));
}
// ─────────────────────── stockPercent ─────────────── END ────────────────────

// ─────────────────────── adjustQty ─────────────── START ──────────────────
// calls:     none
// called by: L2/useInventory: adjust
export function adjustQty(current, delta) {
  return Math.max(0, Math.round((current + delta) * 100) / 100);
}
// ─────────────────────── adjustQty ─────────────── END ────────────────────
