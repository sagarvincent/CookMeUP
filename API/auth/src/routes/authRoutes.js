const { Router }      = require('express');
const { authenticate } = require('../middleware/authenticate');
const {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} = require('../services/authService');

const router = Router();

// ----------------------- POST /auth/register ---------------------------- START
// calls:     registerUser (L2)
// called by: Express router (public)
// ----------------------- POST /auth/register ---------------------------- END
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body ?? {};
    const result = await registerUser(email, password, name);
    res.status(201).json(result);
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message });
  }
});

// ----------------------- POST /auth/login ------------------------------- START
// calls:     loginUser (L2)
// called by: Express router (public)
// ----------------------- POST /auth/login ------------------------------- END
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    const result = await loginUser(email, password);
    res.json(result);
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message });
  }
});

// ----------------------- POST /auth/refresh ----------------------------- START
// calls:     refreshSession (L2)
// called by: Express router (public — caller provides refresh token in body)
// ----------------------- POST /auth/refresh ----------------------------- END
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body ?? {};
    const result = await refreshSession(refreshToken);
    res.json(result);
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message });
  }
});

// ----------------------- POST /auth/logout ------------------------------ START
// calls:     logoutUser (L2)
// called by: Express router (authenticated)
// ----------------------- POST /auth/logout ------------------------------ END
router.post('/logout', authenticate, async (req, res) => {
  try {
    const { refreshToken } = req.body ?? {};
    await logoutUser(refreshToken);
    res.status(204).send();
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message });
  }
});

module.exports = router;
