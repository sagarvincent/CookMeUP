const { nanoid }        = require('nanoid');
const { hashPassword }  = require('../utils/hashUtils');
const { authDb,
        profileDb }     = require('../db/db');

// ----------------------- createUser ------------------------------------- START
// calls:     hashPassword (L4), authDb + profileDb inserts
// called by: authService.registerUser
//
// Hashes the plaintext password, inserts a new user row (Auth DB), and creates
// an empty preferences row (Profile DB).  Returns the new user object.
// ----------------------- createUser ------------------------------------- END
function createUser(email, plainPassword, name) {
  const id   = 'usr_' + nanoid(12);
  const hash = hashPassword(plainPassword);
  const now  = Math.floor(Date.now() / 1000);

  authDb.prepare(
    `INSERT INTO users (id, email, password_hash, name, created_at) VALUES (?, ?, ?, ?, ?)`
  ).run(id, email.toLowerCase(), hash, name ?? null, now);

  profileDb.prepare(
    `INSERT OR IGNORE INTO user_preferences (user_id, updated_at) VALUES (?, ?)`
  ).run(id, now);

  return { id, email: email.toLowerCase(), name: name ?? null };
}

// ----------------------- findUserByEmail -------------------------------- START
// calls:     authDb query
// called by: authService.loginUser, authService.registerUser (duplicate check)
//
// Returns the full user row (including password_hash) or undefined.
// ----------------------- findUserByEmail -------------------------------- END
function findUserByEmail(email) {
  return authDb.prepare(`SELECT * FROM users WHERE email = ?`).get(email.toLowerCase());
}

// ----------------------- findUserById ----------------------------------- START
// calls:     authDb query
// called by: userService.getMyProfile
// ----------------------- findUserById ----------------------------------- END
function findUserById(id) {
  return authDb.prepare(`SELECT id, email, name FROM users WHERE id = ?`).get(id);
}

// ----------------------- getPreferences --------------------------------- START
// calls:     profileDb query
// called by: userService.getMyPreferences
//
// Returns the preferences row with JSON array fields parsed to JS arrays.
// ----------------------- getPreferences --------------------------------- END
function getPreferences(userId) {
  const row = profileDb.prepare(`SELECT * FROM user_preferences WHERE user_id = ?`).get(userId);
  if (!row) return null;
  return {
    diet:       row.diet,
    allergies:  JSON.parse(row.allergies),
    skill:      row.skill,
    targetKcal: row.target_kcal,
    spice:      row.spice,
    cuisines:   JSON.parse(row.cuisines),
    cookFreq:   row.cook_freq,
    equipment:  JSON.parse(row.equipment),
    updatedAt:  row.updated_at,
  };
}

// ----------------------- upsertPreferences ------------------------------ START
// calls:     profileDb upsert
// called by: userService.saveMyPreferences
//
// Inserts or replaces the full preferences row for the given user.
// sanitised is already normalised by validateUtils.sanitisePrefs.
// ----------------------- upsertPreferences ------------------------------ END
function upsertPreferences(userId, sanitised) {
  profileDb.prepare(`
    INSERT INTO user_preferences
      (user_id, diet, allergies, skill, target_kcal, spice, cuisines, cook_freq, equipment, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      diet        = excluded.diet,
      allergies   = excluded.allergies,
      skill       = excluded.skill,
      target_kcal = excluded.target_kcal,
      spice       = excluded.spice,
      cuisines    = excluded.cuisines,
      cook_freq   = excluded.cook_freq,
      equipment   = excluded.equipment,
      updated_at  = excluded.updated_at
  `).run(
    userId,
    sanitised.diet,
    sanitised.allergies,
    sanitised.skill,
    sanitised.target_kcal,
    sanitised.spice,
    sanitised.cuisines,
    sanitised.cook_freq,
    sanitised.equipment,
    sanitised.updated_at
  );

  return getPreferences(userId);
}

module.exports = { createUser, findUserByEmail, findUserById, getPreferences, upsertPreferences };
