const { dietPlanDb } = require('../db/db');
const { nanoid }     = require('nanoid');

const now = () => Math.floor(Date.now() / 1000);

// ----------------------- getPlanRow ------------------------------------- START
// calls:     dietPlanDb (SQLite)
// called by: dietPlanService, autoFillService
// Returns the raw DB row for (userId, week) or undefined if none exists
// ----------------------- getPlanRow ------------------------------------- END
function getPlanRow(userId, week) {
  return dietPlanDb.prepare(
    'SELECT id, plan, created_at, updated_at FROM diet_plans WHERE user_id = ? AND week = ?'
  ).get(userId, week);
}

// ----------------------- upsertPlan ------------------------------------- START
// calls:     dietPlanDb (SQLite)
// called by: dietPlanService, autoFillService
// Inserts a new plan row or updates the plan JSON for an existing (userId, week)
// ----------------------- upsertPlan ------------------------------------- END
function upsertPlan(userId, week, planJson) {
  const t        = now();
  const existing = dietPlanDb.prepare(
    'SELECT id FROM diet_plans WHERE user_id = ? AND week = ?'
  ).get(userId, week);

  if (existing) {
    dietPlanDb.prepare(
      'UPDATE diet_plans SET plan = ?, updated_at = ? WHERE user_id = ? AND week = ?'
    ).run(planJson, t, userId, week);
    return existing.id;
  }

  const id = 'dp_' + nanoid(10);
  dietPlanDb.prepare(
    'INSERT INTO diet_plans (id, user_id, week, plan, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, userId, week, planJson, t, t);
  return id;
}

module.exports = { getPlanRow, upsertPlan };
