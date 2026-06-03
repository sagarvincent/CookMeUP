const { Router }       = require('express');
const { authenticate }  = require('../middleware/authenticate');
const {
  listRecipesService,
  getRecipeService,
  getFeaturedService,
  getRandomService,
  createRecipeService,
  updateRecipeService,
  deleteRecipeService,
} = require('../services/recipeService');

const router = Router();

// ─── helpers ─────────────────────────────────────────────────────────────────
const ok  = (res, data, status = 200) => res.status(status).json(data);
const err = (res, e)  => res.status(e.status ?? 500).json({ error: e.message });

// ----------------------- GET /recipes/featured -------------------------- START
// calls:     getFeaturedService (L2)
// called by: Express router (public)
//
// Must be declared BEFORE /:id so Express doesn't treat "featured" as an id.
// ----------------------- GET /recipes/featured -------------------------- END
router.get('/featured', async (req, res) => {
  try { ok(res, await getFeaturedService()); }
  catch (e) { err(res, e); }
});

// ----------------------- GET /recipes/random ---------------------------- START
// calls:     getRandomService (L2)
// called by: Express router (public)
//
// Accepts the same filter query params as GET /recipes.
// Must be declared BEFORE /:id.
// ----------------------- GET /recipes/random ---------------------------- END
router.get('/random', async (req, res) => {
  try { ok(res, await getRandomService(req.query)); }
  catch (e) { err(res, e); }
});

// ----------------------- GET /recipes ----------------------------------- START
// calls:     listRecipesService (L2)
// called by: Express router (public)
//
// Query params: q, cuisine, course, diet, sort, page, limit
// ----------------------- GET /recipes ----------------------------------- END
router.get('/', async (req, res) => {
  try { ok(res, await listRecipesService(req.query)); }
  catch (e) { err(res, e); }
});

// ----------------------- GET /recipes/:id ------------------------------- START
// calls:     getRecipeService (L2)
// called by: Express router (public)
// ----------------------- GET /recipes/:id ------------------------------- END
router.get('/:id', async (req, res) => {
  try { ok(res, await getRecipeService(req.params.id)); }
  catch (e) { err(res, e); }
});

// ----------------------- POST /recipes ---------------------------------- START
// calls:     createRecipeService (L2)
// called by: Express router (authenticated — admin)
// ----------------------- POST /recipes ---------------------------------- END
router.post('/', authenticate, async (req, res) => {
  try { ok(res, await createRecipeService(req.body ?? {}), 201); }
  catch (e) { err(res, e); }
});

// ----------------------- PUT /recipes/:id ------------------------------- START
// calls:     updateRecipeService (L2)
// called by: Express router (authenticated — admin)
// ----------------------- PUT /recipes/:id ------------------------------- END
router.put('/:id', authenticate, async (req, res) => {
  try { ok(res, await updateRecipeService(req.params.id, req.body ?? {})); }
  catch (e) { err(res, e); }
});

// ----------------------- DELETE /recipes/:id ---------------------------- START
// calls:     deleteRecipeService (L2)
// called by: Express router (authenticated — admin)
// ----------------------- DELETE /recipes/:id ---------------------------- END
router.delete('/:id', authenticate, async (req, res) => {
  try { await deleteRecipeService(req.params.id); res.status(204).send(); }
  catch (e) { err(res, e); }
});

module.exports = router;
