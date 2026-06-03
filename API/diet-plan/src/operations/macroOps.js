const { dietPlanDb } = require('../db/db');

const now = () => Math.floor(Date.now() / 1000);

// ----------------------- getMacroRow ------------------------------------ START
// calls:     dietPlanDb (SQLite)
// called by: macroService getMacros
// Returns the macro_targets row for userId or undefined
// ----------------------- getMacroRow ------------------------------------ END
function getMacroRow(userId) {
  return dietPlanDb.prepare(
    'SELECT preset, kcal, protein_g, carbs_g, fat_g, updated_at FROM macro_targets WHERE user_id = ?'
  ).get(userId);
}

// ----------------------- upsertMacros ----------------------------------- START
// calls:     dietPlanDb (SQLite)
// called by: macroService saveMacros
// Inserts or replaces macro targets for userId using ON CONFLICT upsert
// ----------------------- upsertMacros ----------------------------------- END
function upsertMacros(userId, { preset, kcal, protein_g, carbs_g, fat_g }) {
  dietPlanDb.prepare(`
    INSERT INTO macro_targets (user_id, preset, kcal, protein_g, carbs_g, fat_g, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      preset     = excluded.preset,
      kcal       = excluded.kcal,
      protein_g  = excluded.protein_g,
      carbs_g    = excluded.carbs_g,
      fat_g      = excluded.fat_g,
      updated_at = excluded.updated_at
  `).run(userId, preset, kcal, protein_g, carbs_g, fat_g, now());
}

module.exports = { getMacroRow, upsertMacros };
