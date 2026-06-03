const { Router }       = require('express');
const { authenticate }  = require('../middleware/authenticate');
const {
  getMyProfile,
  getMyPreferences,
  saveMyPreferences,
} = require('../services/userService');

const router = Router();

// All /users/me routes require a valid access token.

// ----------------------- GET /users/me ---------------------------------- START
// calls:     getMyProfile (L2)
// called by: Express router (authenticated)
// ----------------------- GET /users/me ---------------------------------- END
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await getMyProfile(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message });
  }
});

// ----------------------- GET /users/me/preferences ---------------------- START
// calls:     getMyPreferences (L2)
// called by: Express router (authenticated)
// ----------------------- GET /users/me/preferences ---------------------- END
router.get('/me/preferences', authenticate, async (req, res) => {
  try {
    const prefs = await getMyPreferences(req.user.id);
    res.json(prefs);
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message });
  }
});

// ----------------------- PUT /users/me/preferences ---------------------- START
// calls:     saveMyPreferences (L2)
// called by: Express router (authenticated)
// ----------------------- PUT /users/me/preferences ---------------------- END
router.put('/me/preferences', authenticate, async (req, res) => {
  try {
    const saved = await saveMyPreferences(req.user.id, req.body ?? {});
    res.json(saved);
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message });
  }
});

module.exports = router;
