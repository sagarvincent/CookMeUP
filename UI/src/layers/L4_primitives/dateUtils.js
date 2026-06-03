// ─────────────────────── currentGreeting ─────────────── START ──────────────────
// calls:     none
// called by: L2/useIntake: greeting computation
export function currentGreeting() {
  const h = new Date().getHours();
  const part = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  return `Good ${part} · ${date}`;
}
// ─────────────────────── currentGreeting ─────────────── END ────────────────────
