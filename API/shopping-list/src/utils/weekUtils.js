// weekUtils.js — L4 pure utilities for ISO week handling

// ----------------------- currentISOWeek --------------------------------- START
// called by: shoppingService when week param is omitted
// Uses the "nearest Thursday" rule — Thursday always belongs to the
// same ISO year as the week, avoiding year-boundary edge cases.
// ----------------------- currentISOWeek --------------------------------- END
function currentISOWeek() {
  const now      = new Date();
  const thursday = new Date(now);
  // Shift to Thursday of the same week (Mon=0 offset from Mon: (day+6)%7, +3 = Thursday)
  thursday.setUTCDate(now.getUTCDate() - ((now.getUTCDay() + 6) % 7) + 3);
  const yearStart = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));
  const weekNum   = Math.ceil(((thursday - yearStart) / 86400000 + 1) / 7);
  return `${thursday.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

// ----------------------- isValidISOWeek --------------------------------- START
// called by: shoppingService input validation
// ----------------------- isValidISOWeek --------------------------------- END
function isValidISOWeek(str) {
  const m = /^(\d{4})-W(\d{2})$/.exec(str);
  if (!m) return false;
  const wk = parseInt(m[2], 10);
  return wk >= 1 && wk <= 53;
}

module.exports = { currentISOWeek, isValidISOWeek };
