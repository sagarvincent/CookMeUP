// ----------------------- isValidEmail ----------------------------------- START
// calls:     (none)
// called by: authService.registerUser
//
// Returns true if str looks like a valid email address.
// ----------------------- isValidEmail ----------------------------------- END
function isValidEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str ?? '');
}

// ----------------------- isStrongPassword ------------------------------- START
// calls:     (none)
// called by: authService.registerUser
//
// Returns true if str is at least 8 characters.
// ----------------------- isStrongPassword ------------------------------- END
function isStrongPassword(str) {
  return typeof str === 'string' && str.length >= 8;
}

// ----------------------- sanitisePrefs ---------------------------------- START
// calls:     (none)
// called by: userService.saveMyPreferences
//
// Parses and normalises the raw preferences body coming from the request.
// JSON-array fields are accepted as either a JS array or a JSON string.
// Unknown keys are silently dropped.
// ----------------------- sanitisePrefs ---------------------------------- END
function sanitisePrefs(raw) {
  const parseArr = (v) => {
    if (Array.isArray(v))       return JSON.stringify(v);
    if (typeof v === 'string')  return v;           // already serialised
    return '[]';
  };

  return {
    diet:       typeof raw.diet        === 'string' ? raw.diet        : 'Non-Veg',
    allergies:  parseArr(raw.allergies),
    skill:      typeof raw.skill       === 'string' ? raw.skill       : 'Comfortable',
    target_kcal: Number.isFinite(raw.targetKcal) ? raw.targetKcal    : 2100,
    spice:       Number.isFinite(raw.spice)       ? raw.spice        : 5,
    cuisines:    parseArr(raw.cuisines),
    cook_freq:   Number.isFinite(raw.cookFreq)    ? raw.cookFreq     : 4,
    equipment:   parseArr(raw.equipment),
    updated_at:  Math.floor(Date.now() / 1000),
  };
}

module.exports = { isValidEmail, isStrongPassword, sanitisePrefs };
