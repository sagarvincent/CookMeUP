const jwt = require('jsonwebtoken');

// ----------------------- authenticate ----------------------------------- START
// calls:     jwt.verify
// called by: all pantryRoutes (every endpoint is authenticated)
// ----------------------- authenticate ----------------------------------- END
function authenticate(req, res, next) {
  const header = req.headers['authorization'] ?? '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authorization header required' });

  try {
    const secret  = process.env.ACCESS_TOKEN_SECRET ?? 'dev_access_secret';
    const payload = jwt.verify(token, secret);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    const expired = err.name === 'TokenExpiredError';
    return res.status(401).json({ error: expired ? 'Token expired' : 'Invalid token' });
  }
}

module.exports = { authenticate };
