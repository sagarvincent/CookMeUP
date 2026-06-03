// icalUtils.js — L4 pure utilities for RFC 5545 iCal generation

// ----------------------- escapeIcal ------------------------------------- START
// called by: buildIcal
// Escapes special characters per RFC 5545 §3.3.11
// ----------------------- escapeIcal ------------------------------------- END
function escapeIcal(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/;/g,  '\\;')
    .replace(/,/g,  '\\,')
    .replace(/\n/g, '\\n');
}

// ----------------------- formatIcalDate --------------------------------- START
// called by: buildIcal
// Formats a Date as YYYYMMDD for all-day event DATE values
// ----------------------- formatIcalDate --------------------------------- END
function formatIcalDate(date) {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

// ----------------------- buildIcal -------------------------------------- START
// called by: autoFillService calendarExport
// Builds a complete .ics string for a diet plan week.
//   plan:   { Mon: { Breakfast: recipeId|null, … }, … }
//   titles: Map<recipeId, title>
//   dates:  { Mon: Date, … }
// Each filled slot becomes one all-day VEVENT.
// ----------------------- buildIcal -------------------------------------- END
function buildIcal(week, plan, titles, dates) {
  const now = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mise & Plate//Diet Plan//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Diet Plan ${week}`,
  ];

  const MEAL_ORDER = ['Breakfast', 'Lunch', 'Dinner'];

  Object.entries(plan).forEach(([day, meals]) => {
    const date = dates[day];
    if (!date) return;
    const dateStr = formatIcalDate(date);
    const next    = new Date(date);
    next.setUTCDate(date.getUTCDate() + 1);
    const nextStr = formatIcalDate(next);

    MEAL_ORDER.forEach(meal => {
      const recipeId = meals?.[meal];
      if (!recipeId) return;
      const title = titles.get(recipeId) ?? recipeId;
      const uid   = `${week}-${day}-${meal}@mise-and-plate`.toLowerCase().replace(/\s/g, '-');
      lines.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${now}`,
        `DTSTART;VALUE=DATE:${dateStr}`,
        `DTEND;VALUE=DATE:${nextStr}`,
        `SUMMARY:${escapeIcal(meal + ': ' + title)}`,
        `CATEGORIES:${escapeIcal(meal)}`,
        'END:VEVENT',
      );
    });
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

module.exports = { buildIcal, formatIcalDate, escapeIcal };
