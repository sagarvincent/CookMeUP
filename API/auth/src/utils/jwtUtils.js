const jwt = require('jsonwebtoken');

// ----------------------- signAccessToken -------------------------------- START
// calls:     jwt.sign
// called by: tokenOps.issueTokenPair
//
// Signs a short-lived access token (default 15 min) with the user's id and email.
// ----------------------- signAccessToken -------------------------------- END
function signAccessToken(payload) {
  const secret = process.env.ACCESS_TOKEN_SECRET ?? 'dev_access_secret';
  const ttl    = parseInt(process.env.ACCESS_TOKEN_TTL ?? '900', 10);
  return jwt.sign(payload, secret, { expiresIn: ttl });
}

// ----------------------- signRefreshToken ------------------------------- START
// calls:     jwt.sign
// called by: tokenOps.issueTokenPair
//
// Signs a long-lived refresh token (default 30 days).  The raw token string is
// also stored in the DB so it can be revoked on rotation.
// ----------------------- signRefreshToken ------------------------------- END
function signRefreshToken(payload) {
  const secret = process.env.REFRESH_TOKEN_SECRET ?? 'dev_refresh_secret';
  const ttl    = parseInt(process.env.REFRESH_TOKEN_TTL ?? '2592000', 10);
  return jwt.sign(payload, secret, { expiresIn: ttl });
}

// ----------------------- verifyAccessToken ------------------------------ START
// calls:     jwt.verify
// called by: authenticate middleware
//
// Verifies the access token signature and expiry.  Returns the decoded payload
// or throws a JsonWebTokenError / TokenExpiredError.
// ----------------------- verifyAccessToken ------------------------------ END
function verifyAccessToken(token) {
  const secret = process.env.ACCESS_TOKEN_SECRET ?? 'dev_access_secret';
  return jwt.verify(token, secret);
}

// ----------------------- verifyRefreshToken ----------------------------- START
// calls:     jwt.verify
// called by: tokenOps.rotateRefresh
//
// Verifies the refresh token signature and expiry.
// ----------------------- verifyRefreshToken ----------------------------- END
function verifyRefreshToken(token) {
  const secret = process.env.REFRESH_TOKEN_SECRET ?? 'dev_refresh_secret';
  return jwt.verify(token, secret);
}

// ----------------------- decodePayload ---------------------------------- START
// calls:     jwt.decode
// called by: (frontend-side equivalent — unused on backend; exported for tests)
//
// Decodes a JWT without verification (no secret needed).  Never trust for auth.
// ----------------------- decodePayload ---------------------------------- END
function decodePayload(token) {
  return jwt.decode(token);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodePayload,
};
