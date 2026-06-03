// ----------------------- parseImportPayload ----------------------------- START
// calls:     (none — pure parsing)
// called by: pantryService.bulkImport
//
// Accepts either:
//   - A JSON array directly: [{ name, qty, unit, category, expires }, ...]
//   - A CSV string with header row: name,qty,unit,category,expires
//
// Returns { items: SanitisedItem[], errors: string[] }.
// ----------------------- parseImportPayload ----------------------------- END
function parseImportPayload(payload) {
  if (Array.isArray(payload)) {
    return parseJsonItems(payload);
  }
  if (typeof payload === 'string') {
    return parseCsvString(payload);
  }
  return { items: [], errors: ['Payload must be a JSON array or a CSV string'] };
}

function parseJsonItems(arr) {
  const items  = [];
  const errors = [];
  for (let i = 0; i < arr.length; i++) {
    const raw = arr[i];
    if (!raw.name || typeof raw.name !== 'string') {
      errors.push(`Row ${i + 1}: name is required`);
      continue;
    }
    items.push({
      name:     raw.name.trim(),
      qty:      Number.isFinite(raw.qty) ? raw.qty : 0,
      unit:     typeof raw.unit     === 'string' ? raw.unit.trim()     : '',
      category: typeof raw.category === 'string' ? raw.category.trim() : 'Other',
      expires:  typeof raw.expires  === 'string' && raw.expires ? raw.expires : null,
    });
  }
  return { items, errors };
}

function parseCsvString(csv) {
  const lines  = csv.trim().split(/\r?\n/);
  const items  = [];
  const errors = [];

  if (lines.length < 2) return { items: [], errors: ['CSV must have a header row and at least one data row'] };

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const nameIdx = headers.indexOf('name');
  if (nameIdx === -1) return { items: [], errors: ['CSV must have a "name" column'] };

  const colIdx = (col) => headers.indexOf(col);

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim());
    const name = cols[nameIdx];
    if (!name) { errors.push(`Row ${i + 1}: name is required`); continue; }

    const qtyRaw = cols[colIdx('qty')];
    items.push({
      name,
      qty:      qtyRaw !== undefined ? parseFloat(qtyRaw) || 0 : 0,
      unit:     cols[colIdx('unit')]     ?? '',
      category: cols[colIdx('category')] ?? 'Other',
      expires:  cols[colIdx('expires')]  ?? null,
    });
  }
  return { items, errors };
}

module.exports = { parseImportPayload };
