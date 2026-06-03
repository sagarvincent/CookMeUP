const jwt = require('jsonwebtoken');

const SECRET = process.env.ACCESS_TOKEN_SECRET ?? 'dev_access_secret';

// ----------------------- authenticate ----------------------------------- START
// calls:     jwt.verify (L4 library)
// called by: all protected routes
// Reads Bearer token, verifies signature, attaches req.user = { id, email }
// ----------------------- authenticate ----------------------------------- END
function authenticate(req, res, next) {
  const header = req.headers.authorization ?? '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = jwt.verify(token, SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (e) {
    const expired = e.name === 'TokenExpiredError';
    res.status(401).json({ error: expired ? 'Token expired' : 'Invalid token' });
  }
}

module.exports = { authenticate };
