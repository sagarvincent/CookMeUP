import { sumMacroKey } from '../L4_primitives/mathUtils.js';

const DAYS  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MEALS = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

// ─────────────────────── seedPlan ─────────────── START ──────────────────
// calls:     none (pure data transformation)
// called by: L1/App: plan useState initializer
//            L2/useDietPlan: initial state
export function seedPlan(recipes) {
  const byCourse  = c => recipes.filter(r => r.course === c);
  const breakfast = byCourse('Breakfast')[0];
  const mains     = recipes.filter(r => r.course === 'Main');
  const sides     = byCourse('Side');
  const salads    = byCourse('Salad');
  const soup      = byCourse('Soup')[0];

  const plan = {};
  DAYS.forEach((d, di) => {
    plan[d] = {
      Breakfast: breakfast,
      Lunch:     mains[(di + 1) % mains.length],
      Snack:     salads[di % salads.length] || soup,
      Dinner:    mains[(di + 3) % mains.length],
    };
  });
  const biryani = recipes.find(r => r.id === 'biryani');
  if (biryani) plan.Fri.Dinner = biryani;
  return plan;
}
// ─────────────────────── seedPlan ─────────────── END ────────────────────

// ─────────────────────── dayTotals ─────────────── START ──────────────────
// calls:     L4/mathUtils: sumMacroKey
// called by: L3/dietPlanOps: weekKcalArray, avgWeekKcal
//            L2/useDietPlan: todayTotals
export function dayTotals(plan, day) {
  const meals = plan[day] || {};
  const macrosList = MEALS.map(m => meals[m]?.macros).filter(Boolean);
  return {
    kcal:    sumMacroKey(macrosList, 'kcal'),
    protein: sumMacroKey(macrosList, 'protein'),
    carbs:   sumMacroKey(macrosList, 'carbs'),
    fat:     sumMacroKey(macrosList, 'fat'),
    fiber:   sumMacroKey(macrosList, 'fiber'),
  };
}
// ─────────────────────── dayTotals ─────────────── END ────────────────────

// ─────────────────────── weekKcalArray ─────────────── START ──────────────────
// calls:     L3/dietPlanOps: dayTotals
// called by: L2/useDietPlan: weekKcal
export function weekKcalArray(plan) {
  return DAYS.map(d => dayTotals(plan, d).kcal || 0);
}
// ─────────────────────── weekKcalArray ─────────────── END ────────────────────

// ─────────────────────── avgWeekKcal ─────────────── START ──────────────────
// calls:     L3/dietPlanOps: weekKcalArray
// called by: L2/useDietPlan: avgKcal
export function avgWeekKcal(plan) {
  const arr = weekKcalArray(plan);
  return Math.round(arr.reduce((s, k) => s + k, 0) / arr.length);
}
// ─────────────────────── avgWeekKcal ─────────────── END ────────────────────

export { DAYS, MEALS };
