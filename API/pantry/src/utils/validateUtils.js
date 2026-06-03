// ----------------------- validateItemBody ------------------------------- START
// calls:     (none — pure validation)
// called by: pantryService.addItem, pantryService.updateItem
//
// Returns { valid: true } or { valid: false, error: string }.
// ----------------------- validateItemBody ------------------------------- END
function validateItemBody(body) {
  if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
    return { valid: false, error: 'name is required' };
  }
  if (body.qty !== undefined && (!Number.isFinite(body.qty) || body.qty < 0)) {
    return { valid: false, error: 'qty must be a non-negative number' };
  }
  return { valid: true };
}

// ----------------------- sanitiseItemBody ------------------------------- START
// calls:     (none — pure transformation)
// called by: pantryService.addItem, pantryService.updateItem
// ----------------------- sanitiseItemBody ------------------------------- END
function sanitiseItemBody(body) {
  return {
    name:     body.name.trim(),
    qty:      Number.isFinite(body.qty) ? body.qty : 0,
    unit:     typeof body.unit     === 'string' ? body.unit.trim()     : '',
    category: typeof body.category === 'string' ? body.category.trim() : 'Other',
    expires:  typeof body.expires  === 'string' && body.expires ? body.expires : null,
  };
}

// ----------------------- validateDelta ---------------------------------- START
// calls:     (none — pure validation)
// called by: pantryService.adjustQty
// ----------------------- validateDelta ---------------------------------- END
function validateDelta(delta) {
  if (!Number.isFinite(delta)) return { valid: false, error: 'delta must be a number' };
  return { valid: true };
}

module.exports = { validateItemBody, sanitiseItemBody, validateDelta };
