const { getPlanRow, upsertPlan }                   = require('../operations/planOps');
const { parseISOWeek, mergePlan, validateDayMeal } = require('../utils/weekUtils');

// ----------------------- getPlan ---------------------------------------- START
// calls:     parseISOWeek, mergePlan (L4), getPlanRow (L3)
// called by: dietPlanRoutes GET /diet-plan
// Returns the full 7×3 plan skeleton, filling missing slots with null
// ----------------------- getPlan ---------------------------------------- END
function getPlan(userId, week) {
  if (!parseISOWeek(week)) {
    throw Object.assign(new Error('Invalid week — use YYYY-WNN e.g. 2026-W23'), { status: 400 });
  }
  const row    = getPlanRow(userId, week);
  const stored = row ? JSON.parse(row.plan) : {};
  return { week, plan: mergePlan(stored) };
}

// ----------------------- savePlan --------------------------------------- START
// calls:     parseISOWeek, mergePlan (L4), upsertPlan (L3)
// called by: dietPlanRoutes PUT /diet-plan
// Validates the week, normalises the incoming plan onto the 7×3 skeleton, persists
// ----------------------- savePlan --------------------------------------- END
function savePlan(userId, week, incoming) {
  if (!parseISOWeek(week)) {
    throw Object.assign(new Error('Invalid week — use YYYY-WNN e.g. 2026-W23'), { status: 400 });
  }
  if (!incoming || typeof incoming !== 'object') {
    throw Object.assign(
      new Error('Body must be an object { Mon: { Breakfast: id|null, … }, … }'),
      { status: 400 }
    );
  }
  const plan = mergePlan(incoming);
  upsertPlan(userId, week, JSON.stringify(plan));
  return { week, plan };
}

// ----------------------- updateSlot ------------------------------------- START
// calls:     parseISOWeek, validateDayMeal (L4), getPlanRow, upsertPlan (L3)
// called by: dietPlanRoutes PATCH /diet-plan/:week/:day/:meal
// Loads the current plan, swaps the single slot, persists
// ----------------------- updateSlot ------------------------------------- END
function updateSlot(userId, week, day, meal, recipeId) {
  if (!parseISOWeek(week)) {
    throw Object.assign(new Error('Invalid week format'), { status: 400 });
  }
  if (!validateDayMeal(day, meal)) {
    throw Object.assign(new Error(`Invalid day "${day}" or meal "${meal}"`), { status: 400 });
  }
  const row  = getPlanRow(userId, week);
  const plan = mergePlan(row ? JSON.parse(row.plan) : {});
  plan[day][meal] = recipeId ?? null;
  upsertPlan(userId, week, JSON.stringify(plan));
  return { week, day, meal, recipeId: plan[day][meal] };
}

module.exports = { getPlan, savePlan, updateSlot };
