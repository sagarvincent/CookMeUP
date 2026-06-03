const path     = require('path');
const Database = require('better-sqlite3');
const fs       = require('fs');

// ----------------------- openDb ----------------------------------------- START
// calls:     (none — pure setup)
// called by: module load
// Opens a SQLite file, applying the init.sql schema on first boot.
// ----------------------- openDb ----------------------------------------- END
function openDb(envKey, defaultPath, initSqlPath) {
  const dbPath = process.env[envKey] ?? defaultPath;
  const dir    = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  const schema = fs.readFileSync(initSqlPath, 'utf8');
  db.exec(schema);
  console.log(`[diet-plan] DB ready: ${dbPath}`);
  return db;
}

const dietPlanDb = openDb(
  'DIET_PLAN_DB_PATH',
  path.resolve(__dirname, '../../../data/diet-plan.db'),
  path.resolve(__dirname, '../../../../Databases/DietPlan/init.sql')
);

module.exports = { dietPlanDb };
