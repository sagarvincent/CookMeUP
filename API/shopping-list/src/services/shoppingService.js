const { fetchDietPlan, fetchAllRecipes, fetchPantry } = require('../utils/fetchUtils');
const { aggregateIngredients, computeShortfall }      = require('../utils/aggregateUtils');
const { getChecks, setCheck }                          = require('../operations/checkOps');
const { currentISOWeek, isValidISOWeek }              = require('../utils/weekUtils');

// ----------------------- getShoppingList -------------------------------- START
// calls:     fetchDietPlan, fetchAllRecipes, fetchPantry (L4),
//            aggregateIngredients, computeShortfall (L4),
//            getChecks (L3)
// called by: shoppingRoutes GET /shopping-list
//
// Computation pipeline:
//   1. Get this week's diet plan → collect recipe IDs
//   2. Fetch all recipes → build id→recipe map
//   3. Aggregate ingredients across all 21 slots (same recipe multiple times = ×n qty)
//   4. Fetch pantry → compute shortfall (needed − on-hand, unit-matched)
//   5. Merge check state → return sorted shortfall list
// ----------------------- getShoppingList -------------------------------- END
async function getShoppingList(userId, weekParam, token) {
  const week = weekParam
    ? (isValidISOWeek(weekParam) ? weekParam : null)
    : currentISOWeek();

  if (!week) {
    throw Object.assign(new Error('Invalid week — use YYYY-WNN e.g. 2026-W23'), { status: 400 });
  }

  // Fetch upstream data in parallel — diet plan and pantry need auth, recipes do not
  const [plan, recipeMap, pantryItems] = await Promise.all([
    fetchDietPlan(token, week).catch(() => ({})),
    fetchAllRecipes().catch(() => new Map()),
    fetchPantry(token).catch(() => []),
  ]);

  const aggregated = aggregateIngredients(plan, recipeMap);
  const shortfall  = computeShortfall(aggregated, pantryItems);

  // Merge persisted check state
  const checks = getChecks(userId, week);
  shortfall.forEach(item => {
    item.checked = checks.get(item.name.toLowerCase()) ?? false;
  });

  return {
    week,
    items:      shortfall,
    allChecked: shortfall.length > 0 && shortfall.every(i => i.checked),
  };
}

// ----------------------- toggleCheck ------------------------------------ START
// calls:     isValidISOWeek (L4), setCheck (L3)
// called by: shoppingRoutes PATCH /shopping-list/:ingredient/check|uncheck
// ----------------------- toggleCheck ------------------------------------ END
function toggleCheck(userId, week, ingredient, checked) {
  if (!week || !isValidISOWeek(week)) {
    throw Object.assign(new Error('week body field required (YYYY-WNN)'), { status: 400 });
  }
  if (!ingredient || typeof ingredient !== 'string') {
    throw Object.assign(new Error('ingredient param required'), { status: 400 });
  }
  setCheck(userId, week, ingredient, checked);
  return { week, ingredient, checked };
}

// ----------------------- sendToPhone ------------------------------------ START
// calls:     (none — stub until Notifications service is built)
// called by: shoppingRoutes POST /shopping-list/send
// Returns 202 Accepted. The Notifications service (Service #10) will handle
// actual SMS/push delivery when wired up.
// ----------------------- sendToPhone ------------------------------------ END
function sendToPhone(userId, week) {
  if (!week || !isValidISOWeek(week)) {
    throw Object.assign(new Error('week body field required (YYYY-WNN)'), { status: 400 });
  }
  console.log(`[shopping-list] send-to-phone requested: user=${userId} week=${week}`);
  return { queued: true, week, message: 'Notification queued (Notifications service pending)' };
}

module.exports = { getShoppingList, toggleCheck, sendToPhone };
