const path     = require('path');
const Database = require('better-sqlite3');
const fs       = require('fs');

// ----------------------- openDb ----------------------------------------- START
// calls:     (none — pure setup)
// called by: module load
// ----------------------- openDb ----------------------------------------- END
function openDb(envKey, defaultPath, initSqlPath) {
  const dbPath = process.env[envKey] ?? defaultPath;
  const dir    = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(fs.readFileSync(initSqlPath, 'utf8'));
  console.log(`[shopping-list] DB ready: ${dbPath}`);
  return db;
}

const shoppingDb = openDb(
  'SHOPPING_LIST_DB_PATH',
  path.resolve(__dirname, '../../../data/shopping-list.db'),
  path.resolve(__dirname, '../../../../Databases/ShoppingList/init.sql')
);

module.exports = { shoppingDb };
