const { validateItemBody, sanitiseItemBody, validateDelta } = require('../utils/validateUtils');
const { parseImportPayload }  = require('../utils/importUtils');
const {
  getItems,
  getItemById,
  insertItem,
  replaceItem,
  removeItem,
  shiftQty,
  bulkInsert,
  decrementByName,
} = require('../operations/pantryOps');

// ----------------------- listItems -------------------------------------- START
// calls:     getItems (L3)
// called by: pantryRoutes GET /pantry
// ----------------------- listItems -------------------------------------- END
async function listItems(userId, query) {
  return getItems(userId, query);
}

// ----------------------- getItem ---------------------------------------- START
// calls:     getItemById (L3)
// called by: pantryRoutes GET /pantry/:id
// ----------------------- getItem ---------------------------------------- END
async function getItem(userId, id) {
  const item = getItemById(userId, id);
  if (!item) throw Object.assign(new Error('Item not found'), { status: 404 });
  return item;
}

// ----------------------- addItem ---------------------------------------- START
// calls:     validateItemBody, sanitiseItemBody (L4), insertItem (L3)
// called by: pantryRoutes POST /pantry
// ----------------------- addItem ---------------------------------------- END
async function addItem(userId, body) {
  const { valid, error } = validateItemBody(body);
  if (!valid) throw Object.assign(new Error(error), { status: 400 });
  return insertItem(userId, sanitiseItemBody(body));
}

// ----------------------- updateItem ------------------------------------- START
// calls:     validateItemBody, sanitiseItemBody (L4), replaceItem (L3)
// called by: pantryRoutes PUT /pantry/:id
// ----------------------- updateItem ------------------------------------- END
async function updateItem(userId, id, body) {
  const { valid, error } = validateItemBody(body);
  if (!valid) throw Object.assign(new Error(error), { status: 400 });
  const item = replaceItem(userId, id, sanitiseItemBody(body));
  if (!item) throw Object.assign(new Error('Item not found'), { status: 404 });
  return item;
}

// ----------------------- deleteItem ------------------------------------- START
// calls:     removeItem (L3)
// called by: pantryRoutes DELETE /pantry/:id
// ----------------------- deleteItem ------------------------------------- END
async function deleteItem(userId, id) {
  if (!removeItem(userId, id)) throw Object.assign(new Error('Item not found'), { status: 404 });
}

// ----------------------- adjustQty -------------------------------------- START
// calls:     validateDelta (L4), shiftQty (L3)
// called by: pantryRoutes PATCH /pantry/:id/qty
// ----------------------- adjustQty -------------------------------------- END
async function adjustQty(userId, id, delta) {
  const { valid, error } = validateDelta(delta);
  if (!valid) throw Object.assign(new Error(error), { status: 400 });
  const item = shiftQty(userId, id, delta);
  if (!item) throw Object.assign(new Error('Item not found'), { status: 404 });
  return item;
}

// ----------------------- bulkImport ------------------------------------- START
// calls:     parseImportPayload (L4), bulkInsert (L3)
// called by: pantryRoutes POST /pantry/bulk-import
// ----------------------- bulkImport ------------------------------------- END
async function bulkImport(userId, payload) {
  const { items, errors } = parseImportPayload(payload);
  if (items.length === 0 && errors.length > 0) {
    throw Object.assign(new Error(errors.join('; ')), { status: 400 });
  }
  const updated = bulkInsert(userId, items);
  return { imported: items.length, errors, pantry: updated };
}

// ----------------------- decrementItems --------------------------------- START
// calls:     decrementByName (L3)
// called by: pantryRoutes POST /pantry/decrement
//
// Called by the Cooking Session service (or frontend) when a cook completes.
// Body: [{ name: string, qty: number }, ...]
// ----------------------- decrementItems --------------------------------- END
async function decrementItems(userId, decrements) {
  if (!Array.isArray(decrements) || decrements.length === 0) {
    throw Object.assign(new Error('Body must be a non-empty array of { name, qty }'), { status: 400 });
  }
  const updated = decrementByName(userId, decrements);
  return { decremented: updated };
}

module.exports = {
  listItems,
  getItem,
  addItem,
  updateItem,
  deleteItem,
  adjustQty,
  bulkImport,
  decrementItems,
};
