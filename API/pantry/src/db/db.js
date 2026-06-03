const Database = require('better-sqlite3');
const path     = require('path');
const fs       = require('fs');
const { nanoid }         = require('nanoid');
const { DEMO_INVENTORY } = require('../../seed/inventoryData');

// ----------------------- openDb ----------------------------------------- START
// calls:     better-sqlite3 Database constructor
// called by: module initialisation
// ----------------------- openDb ----------------------------------------- END
function openDb() {
  const dbPath = process.env.PANTRY_DB_PATH
    ?? path.resolve(__dirname, '../../../data/pantry.db');

  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  const sql = fs.readFileSync(
    path.resolve(__dirname, '../../../../Databases/Pantry/init.sql'),
    'utf8'
  );
  db.exec(sql);
  return db;
}

const db = openDb();

// ----------------------- seedDemoInventory ------------------------------ START
// calls:     nanoid, db INSERT OR IGNORE
// called by: module initialisation (after schema)
//
// Inserts demo pantry items for usr_demo if none exist yet.  Idempotent —
// keyed on (user_id, name COLLATE NOCASE).
// ----------------------- seedDemoInventory ------------------------------ END
function seedDemoInventory() {
  const existing = db.prepare(
    `SELECT COUNT(*) AS n FROM pantry_items WHERE user_id = ?`
  ).get('usr_demo').n;
  if (existing > 0) return;

  const insert = db.prepare(`
    INSERT OR IGNORE INTO pantry_items (id, user_id, name, qty, unit, category, expires, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const now = Math.floor(Date.now() / 1000);

  const insertAll = db.transaction(() => {
    for (const item of DEMO_INVENTORY) {
      insert.run('pi_' + nanoid(10), 'usr_demo', item.name, item.qty, item.unit, item.category, item.expires ?? null, now, now);
    }
  });
  insertAll();
  console.log(`[db] Seeded ${DEMO_INVENTORY.length} pantry items for usr_demo`);
}

seedDemoInventory();

module.exports = { db };
