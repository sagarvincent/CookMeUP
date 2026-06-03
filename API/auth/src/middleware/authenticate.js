const { verifyAccessToken } = require('../utils/jwtUtils');

// ----------------------- authenticate ----------------------------------- START
// calls:     verifyAccessToken (L4)
// called by: userRoutes (all protected endpoints)
//
// Express middleware that reads the Bearer token from the Authorization header,
// verifies it, and attaches { id, email } to req.user.
// Returns 401 if the header is missing, the token is malformed, or it is expired.
// ----------------------- authenticate ----------------------------------- END
function authenticate(req, res, next) {
  const header = req.headers['authorization'] ?? '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authorization header required' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    const expired = err.name === 'TokenExpiredError';
    return res.status(401).json({ error: expired ? 'Token expired' : 'Invalid token' });
  }
}

module.exports = { authenticate };
