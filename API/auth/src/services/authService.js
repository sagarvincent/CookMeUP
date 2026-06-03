const { isValidEmail,
        isStrongPassword }  = require('../utils/validateUtils');
const { comparePassword }   = require('../utils/hashUtils');
const { issueTokenPair,
        rotateRefresh,
        revokeRefresh }     = require('../operations/tokenOps');
const { createUser,
        findUserByEmail }   = require('../operations/userOps');

// ----------------------- registerUser ----------------------------------- START
// calls:     isValidEmail, isStrongPassword (L4), createUser, issueTokenPair (L3)
// called by: authRoutes POST /auth/register
//
// Validates inputs, checks for duplicate email, creates the user, issues tokens.
// Returns { accessToken, refreshToken, user }.
// ----------------------- registerUser ----------------------------------- END
async function registerUser(email, password, name) {
  if (!isValidEmail(email))       throw Object.assign(new Error('Invalid email'), { status: 400 });
  if (!isStrongPassword(password)) throw Object.assign(new Error('Password must be at least 8 characters'), { status: 400 });

  if (findUserByEmail(email)) throw Object.assign(new Error('Email already registered'), { status: 409 });

  const user   = createUser(email, password, name);
  const tokens = issueTokenPair(user.id, user.email);

  return { ...tokens, user };
}

// ----------------------- loginUser -------------------------------------- START
// calls:     findUserByEmail (L3), comparePassword (L4), issueTokenPair (L3)
// called by: authRoutes POST /auth/login
//
// Looks up the user by email, verifies the password hash, and issues tokens.
// Returns { accessToken, refreshToken, user }.
// ----------------------- loginUser -------------------------------------- END
async function loginUser(email, password) {
  const row = findUserByEmail(email);
  // intentionally vague message — avoids email enumeration
  if (!row) throw Object.assign(new Error('Invalid email or password'), { status: 401 });

  const match = comparePassword(password, row.password_hash);
  if (!match) throw Object.assign(new Error('Invalid email or password'), { status: 401 });

  const tokens = issueTokenPair(row.id, row.email);
  const user   = { id: row.id, email: row.email, name: row.name };

  return { ...tokens, user };
}

// ----------------------- refreshSession --------------------------------- START
// calls:     rotateRefresh (L3)
// called by: authRoutes POST /auth/refresh
//
// Rotates the refresh token — old token is invalidated, new pair is issued.
// ----------------------- refreshSession --------------------------------- END
async function refreshSession(refreshToken) {
  if (!refreshToken) throw Object.assign(new Error('Refresh token required'), { status: 400 });
  return rotateRefresh(refreshToken);
}

// ----------------------- logoutUser ------------------------------------- START
// calls:     revokeRefresh (L3)
// called by: authRoutes POST /auth/logout
//
// Revokes the refresh token so it cannot be rotated again after logout.
// ----------------------- logoutUser ------------------------------------- END
async function logoutUser(refreshToken) {
  if (refreshToken) revokeRefresh(refreshToken);
}

module.exports = { registerUser, loginUser, refreshSession, logoutUser };
