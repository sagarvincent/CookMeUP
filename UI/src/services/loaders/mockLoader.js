// ─────────────────────── loadAllData (mock) ─────────────── START ──────────────────
// calls:     data/mock/recipes, data/mock/inventory, data/mock/constants (dynamic import)
// called by: services/dataService: loadAllData (via @data-loader alias, dev_local only)
export async function loadAllData() {
  const [{ RECIPES }, { INVENTORY }, constants] = await Promise.all([
    import('../../data/mock/recipes.js'),
    import('../../data/mock/inventory.js'),
    import('../../data/mock/constants.js'),
  ]);
  return {
    recipes:        RECIPES,
    inventory:      INVENTORY,
    cuisines:       constants.CUISINES,
    courses:        constants.COURSES,
    diets:          constants.DIETS,
    dietTargets:    constants.DIET_TARGETS,
    assistantLines: constants.ASSISTANT_LINES,
  };
}
// ─────────────────────── loadAllData (mock) ─────────────── END ────────────────────
