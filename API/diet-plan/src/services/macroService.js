const { getMacroRow, upsertMacros } = require('../operations/macroOps');

const PRESETS = {
  'High protein':  { kcal: 2200, protein_g: 180, carbs_g: 180, fat_g: 70  },
  'Low carb':      { kcal: 1800, protein_g: 150, carbs_g:  80, fat_g: 100 },
  'Mediterranean': { kcal: 2000, protein_g: 120, carbs_g: 220, fat_g:  80 },
  'Custom':        { kcal: 2000, protein_g: 150, carbs_g: 200, fat_g:  70 },
};

const DEFAULT = { preset: 'Custom', ...PRESETS['Custom'] };

// ----------------------- getMacros -------------------------------------- START
// calls:     getMacroRow (L3)
// called by: macroRoutes GET /users/me/macro-targets
// Returns stored targets or default Custom preset if none saved yet
// ----------------------- getMacros -------------------------------------- END
function getMacros(userId) {
  return getMacroRow(userId) ?? { ...DEFAULT };
}

// ----------------------- saveMacros ------------------------------------- START
// calls:     upsertMacros (L3)
// called by: macroRoutes PUT /users/me/macro-targets
// If a known preset name is sent without explicit values, applies preset defaults.
// Custom numeric values always take precedence over preset defaults.
// ----------------------- saveMacros ------------------------------------- END
function saveMacros(userId, body) {
  const { preset = 'Custom', kcal, protein_g, carbs_g, fat_g } = body ?? {};
  const base    = PRESETS[preset] ?? PRESETS['Custom'];
  const targets = {
    preset,
    kcal:      kcal      != null ? Number(kcal)      : base.kcal,
    protein_g: protein_g != null ? Number(protein_g) : base.protein_g,
    carbs_g:   carbs_g   != null ? Number(carbs_g)   : base.carbs_g,
    fat_g:     fat_g     != null ? Number(fat_g)     : base.fat_g,
  };
  upsertMacros(userId, targets);
  return targets;
}

module.exports = { getMacros, saveMacros, PRESETS };
