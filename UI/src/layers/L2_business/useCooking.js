import { useState, useEffect, useRef } from 'react';
import { buildMorphStyles, seeingFor, smartReply, nextAssistantLine } from '../L3_composite/cookingOps.js';
import { fmtTime, computeMorph } from '../L4_primitives/cookingUtils.js';

// ─────────────────────── useCooking ─────────────── START ──────────────────
// calls:     L3/cookingOps: buildMorphStyles, seeingFor, smartReply, nextAssistantLine
//            L4/cookingUtils: fmtTime, computeMorph
// called by: components/screens/CookingScreen
export function useCooking({ recipe, assistantLines }) {
  const steps = recipe.steps;

  const [stepIdx,  setStepIdx]  = useState(0);
  const [chat,     setChat]     = useState(() => [
    { from: 'asst', text: assistantLines[0]?.text ?? '', ts: '0:00' },
  ]);
  const [input,    setInput]    = useState('');
  const [voice,    setVoice]    = useState(false);
  const [cam,      setCam]      = useState(true);
  const [elapsed,  setElapsed]  = useState(0);
  const [running,  setRunning]  = useState(true);
  const chatRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chat]);

  const morph       = computeMorph(stepIdx, steps.length);
  const morphStyles = buildMorphStyles(stepIdx, steps.length);
  const seeLabel    = seeingFor(stepIdx);
  const sensorTemp  = Math.round(120 + stepIdx * 22);

  const advance = () => {
    setStepIdx(s => {
      if (s >= steps.length - 1) return s;
      const nx   = s + 1;
      const line = nextAssistantLine(assistantLines, nx);
      if (line) setChat(c => [...c, { from: 'asst', text: line.text, ts: fmtTime(elapsed) }]);
      return nx;
    });
  };

  const back = () => setStepIdx(s => Math.max(0, s - 1));

  const sendMsg = () => {
    if (!input.trim()) return;
    const msg = input;
    setChat(c => [...c, { from: 'user', text: msg, ts: fmtTime(elapsed) }]);
    setInput('');
    setTimeout(() => {
      setChat(c => [...c, { from: 'asst', text: smartReply(msg), ts: fmtTime(elapsed) }]);
    }, 800);
  };

  return {
    stepIdx,
    chat, chatRef,
    input, setInput,
    voice, setVoice,
    cam, setCam,
    elapsed,
    running, setRunning,
    morph,
    morphStyles: morphStyles.style,
    seeLabel,
    sensorTemp,
    advance,
    back,
    sendMsg,
    fmtTime,
  };
}
// ─────────────────────── useCooking ─────────────── END ────────────────────
