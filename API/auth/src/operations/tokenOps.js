const { nanoid }           = require('nanoid');
const { signAccessToken,
        signRefreshToken,
        verifyRefreshToken } = require('../utils/jwtUtils');
const { authDb }            = require('../db/db');

// ----------------------- issueTokenPair --------------------------------- START
// calls:     signAccessToken, signRefreshToken (L4 jwtUtils)
// called by: authService.registerUser, authService.loginUser, tokenOps.rotateRefresh
//
// Creates a fresh access + refresh token pair for the given user.
// Stores the refresh token in the DB with its expiry timestamp.
// Returns { accessToken, refreshToken }.
// ----------------------- issueTokenPair --------------------------------- END
function issueTokenPair(userId, email) {
  const payload      = { sub: userId, email };
  const accessToken  = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const ttl      = parseInt(process.env.REFRESH_TOKEN_TTL ?? '2592000', 10);
  const expiresAt = Math.floor(Date.now() / 1000) + ttl;

  authDb.prepare(
    `INSERT INTO refresh_tokens (token, user_id, expires_at, used) VALUES (?, ?, ?, 0)`
  ).run(refreshToken, userId, expiresAt);

  return { accessToken, refreshToken };
}

// ----------------------- rotateRefresh ---------------------------------- START
// calls:     verifyRefreshToken (L4), issueTokenPair
// called by: authService.refreshSession
//
// Validates the incoming refresh token, marks it as used (single-use rotation),
// then issues a new token pair.  Throws if the token is invalid, expired, or
// already used.
// ----------------------- rotateRefresh ---------------------------------- END
function rotateRefresh(oldToken) {
  const row = authDb.prepare(
    `SELECT * FROM refresh_tokens WHERE token = ?`
  ).get(oldToken);

  if (!row)         throw Object.assign(new Error('Invalid refresh token'), { status: 401 });
  if (row.used)     throw Object.assign(new Error('Refresh token already used'), { status: 401 });
  if (row.expires_at < Math.floor(Date.now() / 1000)) {
    throw Object.assign(new Error('Refresh token expired'), { status: 401 });
  }

  // verify signature — throws TokenExpiredError / JsonWebTokenError if tampered
  const payload = verifyRefreshToken(oldToken);

  authDb.prepare(`UPDATE refresh_tokens SET used = 1 WHERE token = ?`).run(oldToken);

  return issueTokenPair(payload.sub, payload.email);
}

// ----------------------- revokeRefresh ---------------------------------- START
// calls:     (none — direct DB write)
// called by: authService.logoutUser
//
// Marks the given refresh token as used so it cannot be rotated again.
// ----------------------- revokeRefresh ---------------------------------- END
function revokeRefresh(token) {
  authDb.prepare(`UPDATE refresh_tokens SET used = 1 WHERE token = ?`).run(token);
}

module.exports = { issueTokenPair, rotateRefresh, revokeRefresh };
