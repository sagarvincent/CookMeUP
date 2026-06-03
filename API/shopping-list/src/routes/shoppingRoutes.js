const { Router }       = require('express');
const { authenticate }  = require('../middleware/authenticate');
const { getShoppingList, toggleCheck, sendToPhone } = require('../services/shoppingService');

const router = Router();
router.use(authenticate);

const ok  = (res, data, status = 200) => res.status(status).json(data);
const err = (res, e)  => res.status(e.status ?? 500).json({ error: e.message });

// ----------------------- POST /shopping-list/send ----------------------- START
// calls:     sendToPhone (L2)
// called by: Express router
// Declared before /:ingredient routes to avoid "send" being treated as ingredient param.
// Body: { week }
// ----------------------- POST /shopping-list/send ----------------------- END
router.post('/send', (req, res) => {
  const week = req.body?.week;
  try { ok(res, sendToPhone(req.user.id, week), 202); }
  catch (e) { err(res, e); }
});

// ----------------------- GET /shopping-list ----------------------------- START
// calls:     getShoppingList (L2)
// called by: Express router
// Query: week=2026-W23 (optional — defaults to current ISO week)
// ----------------------- GET /shopping-list ----------------------------- END
router.get('/', async (req, res) => {
  try { ok(res, await getShoppingList(req.user.id, req.query.week, req.token)); }
  catch (e) { err(res, e); }
});

// ----------------------- PATCH /shopping-list/:ingredient/check --------- START
// calls:     toggleCheck (L2)
// called by: Express router
// Body: { week }  — ingredient name must be URL-encoded if it contains spaces
// ----------------------- PATCH /shopping-list/:ingredient/check --------- END
router.patch('/:ingredient/check', (req, res) => {
  const ingredient = decodeURIComponent(req.params.ingredient);
  const week       = req.body?.week;
  try { ok(res, toggleCheck(req.user.id, week, ingredient, true)); }
  catch (e) { err(res, e); }
});

// ----------------------- PATCH /shopping-list/:ingredient/uncheck ------- START
// calls:     toggleCheck (L2)
// called by: Express router
// ----------------------- PATCH /shopping-list/:ingredient/uncheck ------- END
router.patch('/:ingredient/uncheck', (req, res) => {
  const ingredient = decodeURIComponent(req.params.ingredient);
  const week       = req.body?.week;
  try { ok(res, toggleCheck(req.user.id, week, ingredient, false)); }
  catch (e) { err(res, e); }
});

module.exports = router;
