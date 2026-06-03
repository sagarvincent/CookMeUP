const { sanitisePrefs }    = require('../utils/validateUtils');
const { findUserById,
        getPreferences,
        upsertPreferences } = require('../operations/userOps');

// ----------------------- getMyProfile ----------------------------------- START
// calls:     findUserById (L3)
// called by: userRoutes GET /users/me
//
// Returns { id, email, name } for the authenticated user.
// ----------------------- getMyProfile ----------------------------------- END
async function getMyProfile(userId) {
  const user = findUserById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  return user;
}

// ----------------------- getMyPreferences ------------------------------- START
// calls:     getPreferences (L3)
// called by: userRoutes GET /users/me/preferences
//
// Returns the parsed preferences object for the authenticated user.
// ----------------------- getMyPreferences ------------------------------- END
async function getMyPreferences(userId) {
  const prefs = getPreferences(userId);
  if (!prefs) throw Object.assign(new Error('Preferences not found'), { status: 404 });
  return prefs;
}

// ----------------------- saveMyPreferences ------------------------------ START
// calls:     sanitisePrefs (L4), upsertPreferences (L3)
// called by: userRoutes PUT /users/me/preferences
//
// Sanitises the incoming request body then upserts the preferences row.
// Returns the saved preferences.
// ----------------------- saveMyPreferences ------------------------------ END
async function saveMyPreferences(userId, body) {
  const sanitised = sanitisePrefs(body);
  return upsertPreferences(userId, sanitised);
}

module.exports = { getMyProfile, getMyPreferences, saveMyPreferences };
