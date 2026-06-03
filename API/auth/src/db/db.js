const Database = require('better-sqlite3');
const path     = require('path');
const fs       = require('fs');
const bcrypt   = require('bcryptjs');

// ----------------------- openDb ----------------------------------------- START
// calls:     better-sqlite3 Database constructor
// called by: module initialisation (runs once on require)
//
// Opens (or creates) a SQLite file, applies the corresponding init.sql schema,
// and returns the live Database handle.
// ----------------------- openDb ----------------------------------------- END
function openDb(envVar, fallback, sqlFile) {
  const dbPath = process.env[envVar] ?? fallback;
  const dir    = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db  = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  const sql = fs.readFileSync(sqlFile, 'utf8');
  db.exec(sql);
  return db;
}

const authDb    = openDb(
  'AUTH_DB_PATH',
  path.resolve(__dirname, '../../../data/auth.db'),
  path.resolve(__dirname, '../../../../Databases/Auth/init.sql')
);

const profileDb = openDb(
  'PROFILE_DB_PATH',
  path.resolve(__dirname, '../../../data/profile.db'),
  path.resolve(__dirname, '../../../../Databases/Profile/init.sql')
);

// ----------------------- seedDemoUser ----------------------------------- START
// calls:     bcrypt.hashSync (L4 equivalent inline — avoids circular dep at init)
// called by: module initialisation (runs once after schema is applied)
//
// Inserts the demo user and their default preferences if they do not already
// exist.  Idempotent: INSERT OR IGNORE means re-runs are safe.
// ----------------------- seedDemoUser ----------------------------------- END
function seedDemoUser() {
  const exists = authDb.prepare('SELECT id FROM users WHERE id = ?').get('usr_demo');
  if (exists) return;

  const hash = bcrypt.hashSync('password123', 10);
  const now  = Math.floor(Date.now() / 1000);

  authDb.prepare(
    `INSERT OR IGNORE INTO users (id, email, password_hash, name, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run('usr_demo', 'demo@mise-and-plate.com', hash, 'Demo User', now);

  profileDb.prepare(
    `INSERT OR IGNORE INTO user_preferences
       (user_id, diet, allergies, skill, target_kcal, spice, cuisines, cook_freq, equipment, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    'usr_demo',
    'Non-Veg',
    JSON.stringify([]),
    'Comfortable',
    2100,
    5,
    JSON.stringify(['indian', 'italian']),
    4,
    JSON.stringify(['Gas range', 'Oven']),
    now
  );

  console.log('[db] Demo user seeded: demo@mise-and-plate.com / password123');
}

seedDemoUser();

module.exports = { authDb, profileDb };
