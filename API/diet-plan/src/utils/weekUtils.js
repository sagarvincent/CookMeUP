// weekUtils.js — L4 pure utilities for ISO week parsing and date arithmetic

const DAYS  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MEALS = ['Breakfast', 'Lunch', 'Dinner'];

// ----------------------- parseISOWeek ----------------------------------- START
// called by: dietPlanService, autoFillService, calendarExport
// Parses "2026-W23" → { year, week } or null if invalid format/range
// ----------------------- parseISOWeek ----------------------------------- END
function parseISOWeek(str) {
  const m = /^(\d{4})-W(\d{2})$/.exec(str);
  if (!m) return null;
  const year = parseInt(m[1], 10);
  const week = parseInt(m[2], 10);
  if (week < 1 || week > 53) return null;
  return { year, week };
}

// ----------------------- weekMonday ------------------------------------- START
// called by: weekDates
// Returns the UTC Date of Monday for the given ISO year/week.
// Jan 4 is always in ISO week 1 — used as a stable anchor.
// ----------------------- weekMonday ------------------------------------- END
function weekMonday(year, weekNum) {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dow  = jan4.getUTCDay() || 7; // Mon=1 … Sun=7
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - (dow - 1) + (weekNum - 1) * 7);
  return monday;
}

// ----------------------- weekDates -------------------------------------- START
// called by: autoFillService calendarExport
// Returns { Mon: Date, Tue: Date, … } for all 7 days of the week
// ----------------------- weekDates -------------------------------------- END
function weekDates(year, weekNum) {
  const monday = weekMonday(year, weekNum);
  const result = {};
  DAYS.forEach((day, i) => {
    const d = new Date(monday);
    d.setUTCDate(monday.getUTCDate() + i);
    result[day] = d;
  });
  return result;
}

// ----------------------- emptyPlan -------------------------------------- START
// called by: mergePlan
// Returns a blank plan: { Mon: { Breakfast: null, Lunch: null, Dinner: null }, … }
// ----------------------- emptyPlan -------------------------------------- END
function emptyPlan() {
  const plan = {};
  DAYS.forEach(day => {
    plan[day] = {};
    MEALS.forEach(meal => { plan[day][meal] = null; });
  });
  return plan;
}

// ----------------------- mergePlan -------------------------------------- START
// called by: dietPlanService, autoFillService
// Merges a stored plan (may be partial/stale) onto a full skeleton so that
// GET always returns all 7 days × 3 meals, even for partially filled weeks.
// ----------------------- mergePlan -------------------------------------- END
function mergePlan(stored) {
  const base = emptyPlan();
  if (!stored || typeof stored !== 'object') return base;
  DAYS.forEach(day => {
    if (stored[day] && typeof stored[day] === 'object') {
      MEALS.forEach(meal => {
        if (stored[day][meal] !== undefined) base[day][meal] = stored[day][meal];
      });
    }
  });
  return base;
}

// ----------------------- validateDayMeal -------------------------------- START
// called by: dietPlanService updateSlot
// Returns true if day is a valid short name and meal is a valid meal name
// ----------------------- validateDayMeal -------------------------------- END
function validateDayMeal(day, meal) {
  return DAYS.includes(day) && MEALS.includes(meal);
}

module.exports = { DAYS, MEALS, parseISOWeek, weekMonday, weekDates, emptyPlan, mergePlan, validateDayMeal };
