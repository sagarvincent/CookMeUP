const { Router }      = require('express');
const { authenticate } = require('../middleware/authenticate');
const { getMacros, saveMacros } = require('../services/macroService');

const router = Router();

const ok  = (res, data) => res.status(200).json(data);
const err = (res, e)    => res.status(e.status ?? 500).json({ error: e.message });

// ----------------------- GET /users/me/macro-targets -------------------- START
// calls:     getMacros (L2)
// called by: Express router
// ----------------------- GET /users/me/macro-targets -------------------- END
router.get('/me/macro-targets', authenticate, (req, res) => {
  try { ok(res, getMacros(req.user.id)); }
  catch (e) { err(res, e); }
});

// ----------------------- PUT /users/me/macro-targets -------------------- START
// calls:     saveMacros (L2)
// called by: Express router
// Body: { preset?, kcal?, protein_g?, carbs_g?, fat_g? }
// Sending only { preset: "High protein" } applies preset defaults.
// ----------------------- PUT /users/me/macro-targets -------------------- END
router.put('/me/macro-targets', authenticate, (req, res) => {
  try { ok(res, saveMacros(req.user.id, req.body)); }
  catch (e) { err(res, e); }
});

module.exports = router;
