const jwt = require('jsonwebtoken');

const SECRET = process.env.ACCESS_TOKEN_SECRET ?? 'dev_access_secret';

// ----------------------- authenticate ----------------------------------- START
// calls:     jwt.verify
// called by: all shopping list routes
// ----------------------- authenticate ----------------------------------- END
function authenticate(req, res, next) {
  const header = req.headers.authorization ?? '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authorization header required' });

  try {
    const payload = jwt.verify(token, SECRET);
    req.user  = { id: payload.sub, email: payload.email };
    req.token = token;
    next();
  } catch (e) {
    const expired = e.name === 'TokenExpiredError';
    res.status(401).json({ error: expired ? 'Token expired' : 'Invalid token' });
  }
}

module.exports = { authenticate };
