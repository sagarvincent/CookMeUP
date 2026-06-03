const { Router }       = require('express');
const { authenticate }  = require('../middleware/authenticate');
const {
  listItems,
  getItem,
  addItem,
  updateItem,
  deleteItem,
  adjustQty,
  bulkImport,
  decrementItems,
} = require('../services/pantryService');

const router = Router();

// All pantry routes require authentication — data is per-user.
router.use(authenticate);

const ok  = (res, data, status = 200) => res.status(status).json(data);
const err = (res, e)  => res.status(e.status ?? 500).json({ error: e.message });

// ----------------------- POST /pantry/bulk-import ----------------------- START
// calls:     bulkImport (L2)
// called by: Express router
// Must be declared before /:id to avoid "bulk-import" being treated as an id.
// ----------------------- POST /pantry/bulk-import ----------------------- END
router.post('/bulk-import', async (req, res) => {
  try { ok(res, await bulkImport(req.user.id, req.body), 200); }
  catch (e) { err(res, e); }
});

// ----------------------- POST /pantry/decrement ------------------------- START
// calls:     decrementItems (L2)
// called by: Express router (called by Cooking Session service on cook complete)
// ----------------------- POST /pantry/decrement ------------------------- END
router.post('/decrement', async (req, res) => {
  try { ok(res, await decrementItems(req.user.id, req.body)); }
  catch (e) { err(res, e); }
});

// ----------------------- GET /pantry ------------------------------------ START
// calls:     listItems (L2)
// called by: Express router
// Query params: q (name search), category
// ----------------------- GET /pantry ------------------------------------ END
router.get('/', async (req, res) => {
  try { ok(res, await listItems(req.user.id, req.query)); }
  catch (e) { err(res, e); }
});

// ----------------------- POST /pantry ----------------------------------- START
// calls:     addItem (L2)
// called by: Express router
// ----------------------- POST /pantry ----------------------------------- END
router.post('/', async (req, res) => {
  try { ok(res, await addItem(req.user.id, req.body ?? {}), 201); }
  catch (e) { err(res, e); }
});

// ----------------------- GET /pantry/:id -------------------------------- START
// calls:     getItem (L2)
// called by: Express router
// ----------------------- GET /pantry/:id -------------------------------- END
router.get('/:id', async (req, res) => {
  try { ok(res, await getItem(req.user.id, req.params.id)); }
  catch (e) { err(res, e); }
});

// ----------------------- PUT /pantry/:id -------------------------------- START
// calls:     updateItem (L2)
// called by: Express router
// ----------------------- PUT /pantry/:id -------------------------------- END
router.put('/:id', async (req, res) => {
  try { ok(res, await updateItem(req.user.id, req.params.id, req.body ?? {})); }
  catch (e) { err(res, e); }
});

// ----------------------- DELETE /pantry/:id ----------------------------- START
// calls:     deleteItem (L2)
// called by: Express router
// ----------------------- DELETE /pantry/:id ----------------------------- END
router.delete('/:id', async (req, res) => {
  try { await deleteItem(req.user.id, req.params.id); res.status(204).send(); }
  catch (e) { err(res, e); }
});

// ----------------------- PATCH /pantry/:id/qty -------------------------- START
// calls:     adjustQty (L2)
// called by: Express router (inline ± buttons on InventoryScreen)
// Body: { delta: number }
// ----------------------- PATCH /pantry/:id/qty -------------------------- END
router.patch('/:id/qty', async (req, res) => {
  try { ok(res, await adjustQty(req.user.id, req.params.id, req.body?.delta)); }
  catch (e) { err(res, e); }
});

module.exports = router;
