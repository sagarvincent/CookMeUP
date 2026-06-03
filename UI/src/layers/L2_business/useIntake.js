import { useState, useEffect, useRef, useMemo } from 'react';
import { matchBestRecipe } from '../L3_composite/recipeFiltering.js';
import { currentGreeting } from '../L4_primitives/dateUtils.js';
import { waveformHeight } from '../L4_primitives/cookingUtils.js';

// ─────────────────────── useIntake ─────────────── START ──────────────────
// calls:     L3/recipeFiltering: matchBestRecipe
//            L4/dateUtils: currentGreeting
//            L4/cookingUtils: waveformHeight
// called by: L1/App (via IntakeScreen props)
//            components/screens/IntakeScreen
export function useIntake({ onPick, recipes }) {
  const [mode,         setMode]         = useState('type');
  const [text,         setText]         = useState('');
  const [listening,    setListening]    = useState(false);
  const [photoDropped, setPhotoDropped] = useState(false);
  const [thinking,     setThinking]     = useState(false);
  const [pulse,        setPulse]        = useState(0);
  const inputRef = useRef(null);

  const greeting = useMemo(() => currentGreeting(), []);

  useEffect(() => {
    if (!listening) return;
    const id = setInterval(() => setPulse(p => p + 1), 120);
    return () => clearInterval(id);
  }, [listening]);

  const waveHeights = useMemo(
    () => Array.from({ length: 24 }, (_, i) => waveformHeight(pulse, i)),
    [pulse]
  );

  const submit = (q) => {
    if (!q?.trim()) return;
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      onPick(matchBestRecipe(recipes, q));
    }, 900);
  };

  return {
    mode, setMode,
    text, setText,
    listening, setListening,
    photoDropped, setPhotoDropped,
    thinking,
    greeting,
    waveHeights,
    inputRef,
    submit,
  };
}
// ─────────────────────── useIntake ─────────────── END ────────────────────
