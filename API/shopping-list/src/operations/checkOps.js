const { shoppingDb } = require('../db/db');

// ----------------------- getChecks -------------------------------------- START
// calls:     shoppingDb (SQLite)
// called by: shoppingService getShoppingList
// Returns a Map<ingredient (lowercase), boolean> for all ticked items this week
// ----------------------- getChecks -------------------------------------- END
function getChecks(userId, week) {
  const rows = shoppingDb.prepare(
    'SELECT ingredient, checked FROM shopping_checks WHERE user_id = ? AND week = ?'
  ).all(userId, week);

  const map = new Map();
  rows.forEach(r => map.set(r.ingredient, r.checked === 1));
  return map;
}

// ----------------------- setCheck --------------------------------------- START
// calls:     shoppingDb (SQLite)
// called by: shoppingService toggleCheck
// Upserts the check state for a single ingredient in the given week
// ----------------------- setCheck --------------------------------------- END
function setCheck(userId, week, ingredient, checked) {
  shoppingDb.prepare(`
    INSERT INTO shopping_checks (user_id, week, ingredient, checked)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, week, ingredient) DO UPDATE SET checked = excluded.checked
  `).run(userId, week, ingredient.toLowerCase(), checked ? 1 : 0);
}

// ----------------------- clearChecks ------------------------------------ START
// calls:     shoppingDb (SQLite)
// called by: (available for future use — e.g. "uncheck all" action)
// Removes all check records for a user/week
// ----------------------- clearChecks ------------------------------------ END
function clearChecks(userId, week) {
  shoppingDb.prepare(
    'DELETE FROM shopping_checks WHERE user_id = ? AND week = ?'
  ).run(userId, week);
}

module.exports = { getChecks, setCheck, clearChecks };
