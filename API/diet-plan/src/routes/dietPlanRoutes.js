const { Router }      = require('express');
const { authenticate } = require('../middleware/authenticate');
const { getPlan, savePlan, updateSlot }  = require('../services/dietPlanService');
const { autoFill, calendarExport }       = require('../services/autoFillService');

const router = Router();
router.use(authenticate);

const ok  = (res, data, status = 200) => res.status(status).json(data);
const err = (res, e)  => res.status(e.status ?? 500).json({ error: e.message });

// ----------------------- POST /diet-plan/auto-fill ---------------------- START
// calls:     autoFill (L2)
// called by: Express router
// Declared before /:week to prevent "auto-fill" being treated as a week param.
// Query: week=2026-W23  Body: { diet?, cuisine?, overwrite? }
// ----------------------- POST /diet-plan/auto-fill ---------------------- END
router.post('/auto-fill', async (req, res) => {
  const { week } = req.query;
  if (!week) return res.status(400).json({ error: 'week query param required (e.g. 2026-W23)' });
  try { ok(res, await autoFill(req.user.id, week, req.body ?? {})); }
  catch (e) { err(res, e); }
});

// ----------------------- GET /diet-plan/calendar-export ----------------- START
// calls:     calendarExport (L2)
// called by: Express router
// Declared before /:week param route.
// Query: week=2026-W23  (format=ical reserved for future)
// Returns .ics file as attachment
// ----------------------- GET /diet-plan/calendar-export ----------------- END
router.get('/calendar-export', async (req, res) => {
  const { week } = req.query;
  if (!week) return res.status(400).json({ error: 'week query param required (e.g. 2026-W23)' });
  try {
    const { ical, filename } = await calendarExport(req.user.id, week);
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(ical);
  } catch (e) { err(res, e); }
});

// ----------------------- GET /diet-plan --------------------------------- START
// calls:     getPlan (L2)
// called by: Express router
// Query: week=2026-W23
// ----------------------- GET /diet-plan --------------------------------- END
router.get('/', (req, res) => {
  const { week } = req.query;
  if (!week) return res.status(400).json({ error: 'week query param required (e.g. 2026-W23)' });
  try { ok(res, getPlan(req.user.id, week)); }
  catch (e) { err(res, e); }
});

// ----------------------- PUT /diet-plan --------------------------------- START
// calls:     savePlan (L2)
// called by: Express router
// Query: week=2026-W23  Body: { Mon: { Breakfast: id|null, … }, … }
// ----------------------- PUT /diet-plan --------------------------------- END
router.put('/', (req, res) => {
  const { week } = req.query;
  if (!week) return res.status(400).json({ error: 'week query param required (e.g. 2026-W23)' });
  try { ok(res, savePlan(req.user.id, week, req.body)); }
  catch (e) { err(res, e); }
});

// ----------------------- PATCH /diet-plan/:week/:day/:meal -------------- START
// calls:     updateSlot (L2)
// called by: Express router
// Body: { recipeId: string|null }
// ----------------------- PATCH /diet-plan/:week/:day/:meal -------------- END
router.patch('/:week/:day/:meal', (req, res) => {
  const { week, day, meal } = req.params;
  try { ok(res, updateSlot(req.user.id, week, day, meal, req.body?.recipeId)); }
  catch (e) { err(res, e); }
});

module.exports = router;
