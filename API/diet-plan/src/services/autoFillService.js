const { getPlanRow, upsertPlan }             = require('../operations/planOps');
const { parseISOWeek, mergePlan, DAYS, MEALS, weekDates } = require('../utils/weekUtils');
const { buildIcal }                          = require('../utils/icalUtils');

const RECIPES_BASE = () => process.env.RECIPES_API_BASE ?? 'http://localhost:3002';

// ----------------------- fetchRecipes ----------------------------------- START
// calls:     fetch (Node 18+ built-in)
// called by: autoFill, calendarExport
// Fetches a pool of recipes from the recipes service with optional filter params.
// Uses a 4-second timeout — if the service is unavailable callers handle the error.
// ----------------------- fetchRecipes ----------------------------------- END
async function fetchRecipes(filters = {}) {
  const params = new URLSearchParams({ limit: '50', sort: 'rating', ...filters });
  const url = `${RECIPES_BASE()}/recipes?${params}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
  if (!res.ok) throw new Error(`Recipes service returned ${res.status}`);
  const data = await res.json();
  // Recipes service returns { recipes: [...] } for paginated list
  return Array.isArray(data) ? data : (data.recipes ?? []);
}

// ----------------------- autoFill --------------------------------------- START
// calls:     fetchRecipes, getPlanRow, upsertPlan (L3), parseISOWeek, mergePlan (L4)
// called by: dietPlanRoutes POST /diet-plan/auto-fill
// Fills empty slots (or all slots if overwrite=true) with recipes from the pool.
// Accepts optional { diet, cuisine, overwrite } in the request body.
// ----------------------- autoFill --------------------------------------- END
async function autoFill(userId, week, { diet, cuisine, overwrite = false } = {}) {
  if (!parseISOWeek(week)) {
    throw Object.assign(new Error('Invalid week — use YYYY-WNN e.g. 2026-W23'), { status: 400 });
  }

  const filters = {};
  if (diet)    filters.diet    = diet;
  if (cuisine) filters.cuisine = cuisine;

  let recipes;
  try {
    recipes = await fetchRecipes(filters);
  } catch (e) {
    throw Object.assign(new Error(`Could not reach recipes service: ${e.message}`), { status: 502 });
  }
  if (!recipes.length) {
    throw Object.assign(new Error('No recipes match the given filters'), { status: 422 });
  }

  const row  = getPlanRow(userId, week);
  const plan = mergePlan(row ? JSON.parse(row.plan) : {});

  // Fisher-Yates shuffle of recipe IDs for random assignment
  const pool = recipes.map(r => r.id);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  let poolIdx = 0;
  DAYS.forEach(day => {
    MEALS.forEach(meal => {
      if (overwrite || !plan[day][meal]) {
        plan[day][meal] = pool[poolIdx % pool.length];
        poolIdx++;
      }
    });
  });

  upsertPlan(userId, week, JSON.stringify(plan));
  return { week, plan };
}

// ----------------------- calendarExport --------------------------------- START
// calls:     fetchRecipes, getPlanRow (L3), buildIcal, weekDates (L4)
// called by: dietPlanRoutes GET /diet-plan/calendar-export
// Returns { ical: string, filename: string } for download as .ics
// Degrades gracefully if recipes service is unreachable — uses recipe IDs as titles
// ----------------------- calendarExport --------------------------------- END
async function calendarExport(userId, week) {
  const parsed = parseISOWeek(week);
  if (!parsed) throw Object.assign(new Error('Invalid week format'), { status: 400 });

  const row  = getPlanRow(userId, week);
  const plan = mergePlan(row ? JSON.parse(row.plan) : {});

  // Collect all recipe IDs referenced in the plan
  const recipeIds = new Set();
  DAYS.forEach(day => MEALS.forEach(meal => {
    if (plan[day][meal]) recipeIds.add(plan[day][meal]);
  }));

  // Resolve titles — degrade gracefully on failure
  const titles = new Map();
  if (recipeIds.size > 0) {
    try {
      const all = await fetchRecipes({ limit: '200' });
      all.forEach(r => { if (recipeIds.has(r.id)) titles.set(r.id, r.title); });
    } catch (_) { /* titles stay empty — IDs used instead */ }
  }

  const dates    = weekDates(parsed.year, parsed.week);
  const ical     = buildIcal(week, plan, titles, dates);
  const filename = `diet-plan-${week}.ics`;

  return { ical, filename };
}

module.exports = { autoFill, calendarExport };
