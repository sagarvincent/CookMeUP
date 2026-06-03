import {
  computeMorph, morphStage, inkColor, onAccentColor, inkSoft,
} from '../L4_primitives/cookingUtils.js';

const STAGE_LABELS = [
  { eyebrow: 'neutral',         label: 'Cookbook view' },
  { eyebrow: 'warming up',      label: 'Spice notes appearing' },
  { eyebrow: 'in the kitchen',  label: 'Indian palette rising' },
  { eyebrow: 'fully landed',    label: 'Hyderabadi dum' },
];

const SEEING_LABELS = [
  'Yogurt marinade · chicken thigh visible',
  'Onions slicing thin · pan preheating',
  'Whole spices crackling in ghee',
  'Rice boiling · about 70% done',
  'Layering in progress · birista on top',
  'Pot sealed · dum stage active',
  'Resting · do not lift the lid',
  'Plating · steam rising',
  'Plated · ready to eat',
];

// ─────────────────────── buildMorphStyles ─────────────── START ──────────────────
// calls:     L4/cookingUtils: computeMorph, inkColor, onAccentColor, inkSoft
// called by: L2/useCooking: morphStyles
export function buildMorphStyles(stepIdx, totalSteps) {
  const morph = computeMorph(stepIdx, totalSteps);
  return {
    morph,
    style: {
      '--morph':       morph,
      '--a-ink':       inkColor(morph),
      '--a-ink-soft':  inkSoft(morph),
      '--a-on-accent': onAccentColor(morph),
      background:      'var(--a-bg-1)',
      color:           'var(--a-ink)',
      minHeight:       '100vh',
      transition:      'background .8s ease, color .35s ease',
    },
  };
}
// ─────────────────────── buildMorphStyles ─────────────── END ────────────────────

// ─────────────────────── getCuisineStageLabel ─────────────── START ──────────────────
// calls:     L4/cookingUtils: morphStage
// called by: L2/useCooking: stageLabel (passed to CuisineHeader)
export function getCuisineStageLabel(morph) {
  return STAGE_LABELS[morphStage(morph)];
}
// ─────────────────────── getCuisineStageLabel ─────────────── END ────────────────────

// ─────────────────────── seeingFor ─────────────── START ──────────────────
// calls:     none
// called by: L2/useCooking: seeLabel
export function seeingFor(stepIdx) {
  return SEEING_LABELS[stepIdx] ?? '—';
}
// ─────────────────────── seeingFor ─────────────── END ────────────────────

// ─────────────────────── smartReply ─────────────── START ──────────────────
// calls:     none
// called by: L2/useCooking: sendMsg handler
export function smartReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('saffron')) return 'Substitute: 1 tsp turmeric steeped in 2 tbsp warm milk + 2 drops rose water. Color is honest, flavor is its own thing.';
  if (m.includes('onion'))   return 'Looking through the camera — they\'re mid-gold right now. Give them 90 seconds more, then pull immediately. Past mahogany, they go bitter.';
  if (m.includes('mushy'))   return 'Drain it on a flat tray, fan it out, salt lightly. Then layer it — the dum will firm it up. Don\'t add more water from here.';
  return 'Tell me what you\'re seeing. If you can, snap a photo — I can read color, texture, and steam pattern.';
}
// ─────────────────────── smartReply ─────────────── END ────────────────────

// ─────────────────────── nextAssistantLine ─────────────── START ──────────────────
// calls:     none
// called by: L2/useCooking: advance handler
export function nextAssistantLine(assistantLines, stepIdx) {
  return assistantLines[stepIdx] ?? null;
}
// ─────────────────────── nextAssistantLine ─────────────── END ────────────────────
