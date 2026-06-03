const { nanoid } = require('nanoid');
const { db }     = require('../db/db');

// ----------------------- getItems --------------------------------------- START
// calls:     db SELECT
// called by: pantryService.listItems
//
// Returns all pantry items for a user, optionally filtered by name (LIKE)
// and/or category.  Ordered by category then name.
// ----------------------- getItems --------------------------------------- END
function getItems(userId, { q, category } = {}) {
  const clauses = ['user_id = ?'];
  const params  = [userId];

  if (q) {
    clauses.push(`LOWER(name) LIKE ?`);
    params.push(`%${q.toLowerCase()}%`);
  }
  if (category) {
    clauses.push(`category = ?`);
    params.push(category);
  }

  return db.prepare(
    `SELECT * FROM pantry_items WHERE ${clauses.join(' AND ')} ORDER BY category, name COLLATE NOCASE`
  ).all(...params);
}

// ----------------------- getItemById ------------------------------------ START
// calls:     db SELECT
// called by: pantryService.getItem, pantryOps.updateItem, pantryOps.adjustQty
// ----------------------- getItemById ------------------------------------ END
function getItemById(userId, id) {
  return db.prepare(`SELECT * FROM pantry_items WHERE id = ? AND user_id = ?`).get(id, userId) ?? null;
}

// ----------------------- insertItem ------------------------------------- START
// calls:     nanoid
// called by: pantryService.addItem
// ----------------------- insertItem ------------------------------------- END
function insertItem(userId, sanitised) {
  const id  = 'pi_' + nanoid(10);
  const now = Math.floor(Date.now() / 1000);

  db.prepare(`
    INSERT INTO pantry_items (id, user_id, name, qty, unit, category, expires, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, userId, sanitised.name, sanitised.qty, sanitised.unit, sanitised.category, sanitised.expires, now, now);

  return getItemById(userId, id);
}

// ----------------------- replaceItem ------------------------------------ START
// calls:     db UPDATE
// called by: pantryService.updateItem
// ----------------------- replaceItem ------------------------------------ END
function replaceItem(userId, id, sanitised) {
  const now = Math.floor(Date.now() / 1000);
  const result = db.prepare(`
    UPDATE pantry_items
    SET name = ?, qty = ?, unit = ?, category = ?, expires = ?, updated_at = ?
    WHERE id = ? AND user_id = ?
  `).run(sanitised.name, sanitised.qty, sanitised.unit, sanitised.category, sanitised.expires, now, id, userId);

  return result.changes > 0 ? getItemById(userId, id) : null;
}

// ----------------------- removeItem ------------------------------------- START
// calls:     db DELETE
// called by: pantryService.deleteItem
// ----------------------- removeItem ------------------------------------- END
function removeItem(userId, id) {
  return db.prepare(`DELETE FROM pantry_items WHERE id = ? AND user_id = ?`).run(id, userId).changes > 0;
}

// ----------------------- shiftQty --------------------------------------- START
// calls:     db UPDATE
// called by: pantryService.adjustQty
//
// Adds delta to qty, clamping to >= 0.
// ----------------------- shiftQty --------------------------------------- END
function shiftQty(userId, id, delta) {
  const now = Math.floor(Date.now() / 1000);
  const result = db.prepare(`
    UPDATE pantry_items
    SET qty = MAX(0, qty + ?), updated_at = ?
    WHERE id = ? AND user_id = ?
  `).run(delta, now, id, userId);

  return result.changes > 0 ? getItemById(userId, id) : null;
}

// ----------------------- bulkInsert ------------------------------------- START
// calls:     nanoid, db transaction
// called by: pantryService.bulkImport
//
// Upserts multiple items by name (case-insensitive): updates qty if the item
// already exists, inserts otherwise.
// ----------------------- bulkInsert ------------------------------------- END
function bulkInsert(userId, items) {
  const now = Math.floor(Date.now() / 1000);

  const upsert = db.prepare(`
    INSERT INTO pantry_items (id, user_id, name, qty, unit, category, expires, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, name COLLATE NOCASE) DO UPDATE SET
      qty        = excluded.qty,
      unit       = excluded.unit,
      category   = excluded.category,
      expires    = excluded.expires,
      updated_at = excluded.updated_at
  `);

  // ON CONFLICT needs a unique index on (user_id, name COLLATE NOCASE).
  // SQLite supports expression indexes — create it here if missing.
  db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_pantry_user_name_unique
    ON pantry_items(user_id, name COLLATE NOCASE)
  `);

  const insertAll = db.transaction((rows) => {
    for (const item of rows) {
      upsert.run('pi_' + nanoid(10), userId, item.name, item.qty, item.unit, item.category, item.expires, now, now);
    }
  });

  insertAll(items);
  return getItems(userId);
}

// ----------------------- decrementByName -------------------------------- START
// calls:     db UPDATE
// called by: pantryService.decrementItems
//
// Batch-decrements pantry quantities by name (case-insensitive).
// Clamps each item to >= 0.  Returns the list of updated item names.
// ----------------------- decrementByName -------------------------------- END
function decrementByName(userId, decrements) {
  const now = Math.floor(Date.now() / 1000);

  const update = db.prepare(`
    UPDATE pantry_items
    SET qty = MAX(0, qty - ?), updated_at = ?
    WHERE user_id = ? AND LOWER(name) = LOWER(?)
  `);

  const updated = [];
  const run = db.transaction((rows) => {
    for (const { name, qty } of rows) {
      const r = update.run(qty, now, userId, name);
      if (r.changes > 0) updated.push(name);
    }
  });
  run(decrements);
  return updated;
}

module.exports = {
  getItems,
  getItemById,
  insertItem,
  replaceItem,
  removeItem,
  shiftQty,
  bulkInsert,
  decrementByName,
};
