// fetchUtils.js — L4 HTTP helpers for calling upstream services

const DIET_PLAN_BASE = () => process.env.DIET_PLAN_API_BASE ?? 'http://localhost:3004';
const RECIPES_BASE   = () => process.env.RECIPES_API_BASE   ?? 'http://localhost:3002';
const PANTRY_BASE    = () => process.env.PANTRY_API_BASE    ?? 'http://localhost:3003';

const TIMEOUT_MS = 5000;
const signal     = () => AbortSignal.timeout(TIMEOUT_MS);

async function json(url, headers = {}) {
  const res = await fetch(url, { headers, signal: signal() });
  if (!res.ok) throw Object.assign(new Error(`Upstream ${url} → ${res.status}`), { status: 502 });
  return res.json();
}

// ----------------------- fetchDietPlan ---------------------------------- START
// called by: shoppingService
// Fetches the user's diet plan for the given week. Forwards Bearer token.
// Returns the plan object { Mon: { Breakfast: id|null, … }, … }
// ----------------------- fetchDietPlan ---------------------------------- END
async function fetchDietPlan(token, week) {
  const data = await json(
    `${DIET_PLAN_BASE()}/diet-plan?week=${encodeURIComponent(week)}`,
    { Authorization: `Bearer ${token}` }
  );
  return data.plan ?? {};
}

// ----------------------- fetchAllRecipes -------------------------------- START
// called by: shoppingService
// Fetches all recipes in one shot (limit=200 covers the full seed set).
// Recipe read endpoints are public — no auth needed.
// Returns a Map<recipeId, recipe>
// ----------------------- fetchAllRecipes -------------------------------- END
async function fetchAllRecipes() {
  const data = await json(`${RECIPES_BASE()}/recipes?limit=200`);
  const list = data.recipes ?? data;
  const map  = new Map();
  list.forEach(r => map.set(r.id, r));
  return map;
}

// ----------------------- fetchPantry ------------------------------------ START
// called by: shoppingService
// Fetches the user's full pantry. Forwards Bearer token.
// Returns an array of pantry items { name, qty, unit, category, … }
// ----------------------- fetchPantry ------------------------------------ END
async function fetchPantry(token) {
  const data = await json(
    `${PANTRY_BASE()}/pantry`,
    { Authorization: `Bearer ${token}` }
  );
  return Array.isArray(data) ? data : (data.items ?? []);
}

module.exports = { fetchDietPlan, fetchAllRecipes, fetchPantry };
