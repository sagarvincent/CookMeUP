const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

// ----------------------- hashPassword ----------------------------------- START
// calls:     bcrypt.hashSync
// called by: userOps.createUser, db.seedDemoUser
//
// Returns the bcrypt hash of a plaintext password.
// ----------------------- hashPassword ----------------------------------- END
function hashPassword(plain) {
  return bcrypt.hashSync(plain, SALT_ROUNDS);
}

// ----------------------- comparePassword -------------------------------- START
// calls:     bcrypt.compareSync
// called by: authService.loginUser
//
// Returns true if plain matches the stored bcrypt hash, false otherwise.
// ----------------------- comparePassword -------------------------------- END
function comparePassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

module.exports = { hashPassword, comparePassword };
