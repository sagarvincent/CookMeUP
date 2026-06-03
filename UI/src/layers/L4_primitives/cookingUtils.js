// ─────────────────────── fmtTime ─────────────── START ──────────────────
// calls:     none
// called by: L3/cookingOps: buildMorphStyles (timer display)
//            L2/useCooking: elapsed display, chat timestamps
export function fmtTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
// ─────────────────────── fmtTime ─────────────── END ────────────────────

// ─────────────────────── computeMorph ─────────────── START ──────────────────
// calls:     none
// called by: L3/cookingOps: buildMorphStyles
//            L2/useCooking: morph scalar
export function computeMorph(stepIdx, totalSteps) {
  if (totalSteps < 2) return 0;
  return stepIdx / (totalSteps - 1);
}
// ─────────────────────── computeMorph ─────────────── END ────────────────────

// ─────────────────────── morphStage ─────────────── START ──────────────────
// calls:     none
// called by: L3/cookingOps: buildMorphStyles
export function morphStage(morph) {
  if (morph < 0.15) return 0;
  if (morph < 0.40) return 1;
  if (morph < 0.70) return 2;
  return 3;
}
// ─────────────────────── morphStage ─────────────── END ────────────────────

// ─────────────────────── inkColor ─────────────── START ──────────────────
// calls:     none
// called by: L3/cookingOps: buildMorphStyles
export function inkColor(morph) {
  return morph < 0.45 ? '#2a241a' : '#fde9be';
}
// ─────────────────────── inkColor ─────────────── END ────────────────────

// ─────────────────────── onAccentColor ─────────────── START ──────────────────
// calls:     none
// called by: L3/cookingOps: buildMorphStyles
export function onAccentColor(morph) {
  return morph < 0.45 ? '#fbf6e9' : '#2a0e08';
}
// ─────────────────────── onAccentColor ─────────────── END ────────────────────

// ─────────────────────── inkSoft ─────────────── START ──────────────────
// calls:     none
// called by: L3/cookingOps: buildMorphStyles
export function inkSoft(morph) {
  return morph < 0.45 ? 'rgba(42,36,26,.7)' : 'rgba(253,233,190,.78)';
}
// ─────────────────────── inkSoft ─────────────── END ────────────────────

// ─────────────────────── waveformHeight ─────────────── START ──────────────────
// calls:     none
// called by: L2/useIntake: waveHeights computation
export function waveformHeight(pulse, i) {
  return 6 + Math.abs(Math.sin((pulse + i * 0.4) * 0.5)) * 18;
}
// ─────────────────────── waveformHeight ─────────────── END ────────────────────
