import { useState, useEffect, useRef } from 'react';
import { ASSISTANT_LINES } from '../data/index';
import {
  IcClock, IcFlame, IcChef, IcMic, IcCamera, IcMessage,
  IcArrow, IcPause, IcPlay, IcVideo, IcWaveform,
} from '../components/Icons';
import { ImageSlot } from '../components/Shell';

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

const seeingFor = (i) => {
  const labels = [
    "Yogurt marinade · chicken thigh visible",
    "Onions slicing thin · pan preheating",
    "Whole spices crackling in ghee",
    "Rice boiling · about 70% done",
    "Layering in progress · birista on top",
    "Pot sealed · dum stage active",
    "Resting · do not lift the lid",
    "Plating · steam rising",
    "Plated · ready to eat",
  ];
  return labels[i] || "—";
};

const smartReply = (msg, step) => {
  const m = msg.toLowerCase();
  if (m.includes("saffron")) return "Substitute: 1 tsp turmeric steeped in 2 tbsp warm milk + 2 drops rose water. Color is honest, flavor is its own thing.";
  if (m.includes("onion")) return "Looking through the camera — they're mid-gold right now. Give them 90 seconds more, then pull immediately. Past mahogany, they go bitter.";
  if (m.includes("mushy")) return "Drain it on a flat tray, fan it out, salt lightly. Then layer it — the dum will firm it up. Don't add more water from here.";
  return "Tell me what you're seeing. If you can, snap a photo — I can read color, texture, and steam pattern.";
};

const CuisineHeader = ({ morph }) => {
  const stage = morph < 0.15 ? 0 : morph < 0.4 ? 1 : morph < 0.7 ? 2 : 3;
  const stages = [
    { eyebrow: "neutral",      label: "Cookbook view" },
    { eyebrow: "warming up",   label: "Spice notes appearing" },
    { eyebrow: "in the kitchen", label: "Indian palette rising" },
    { eyebrow: "fully landed", label: "Hyderabadi dum" },
  ];
  return (
    <div style={{
      padding: "18px 24px 14px",
      borderBottom: "1px solid var(--a-line)",
      position: "relative", overflow: "hidden",
      background: "var(--a-bg-1)",
      transition: "background .6s ease",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          radial-gradient(circle at 90% 30%, rgba(232,154,42,${morph * 0.25}) 0%, transparent 25%),
          radial-gradient(circle at 10% 80%, rgba(212,74,38,${morph * 0.2}) 0%, transparent 30%)
        `,
        pointerEvents: "none",
      }}/>
      <div className="row between" style={{ position: "relative" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="fmono" style={{ fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--a-accent)" }}>
            Theme · {stages[stage].eyebrow}
          </div>
          <div className="fdisp mt-1" style={{ fontSize: 20, lineHeight: 1.15, color: "var(--a-ink)" }}>{stages[stage].label}</div>
        </div>
        <div className="col" style={{ alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
          <div className="fmono" style={{ fontSize: 9.5, color: "var(--a-ink)", opacity: 0.6, letterSpacing: ".1em", textTransform: "uppercase" }}>Cuisine progress</div>
          <div style={{ width: 100, height: 4, background: "rgba(255,255,255,.12)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: (morph * 100) + "%", height: "100%", background: "linear-gradient(90deg, #c98a2a, #d44a26)", transition: "width .6s ease" }}/>
          </div>
        </div>
      </div>
      <div className="row gap-3" style={{ position: "relative", opacity: 0.35 + morph * 0.6, marginTop: 14 }}>
        {["🌶", "🍚", "🌿", "🥘", "✨"].map((g, i) => (
          <span key={i} style={{
            fontSize: 16,
            filter: `grayscale(${1 - morph})`,
            transform: `scale(${0.85 + morph * 0.25})`,
            transition: "all .6s ease",
          }}>{g}</span>
        ))}
      </div>
    </div>
  );
};

const ChatMsg = ({ m }) => {
  const isAsst = m.from === "asst";
  return (
    <div style={{ display: "flex", flexDirection: isAsst ? "row" : "row-reverse", gap: 10 }}>
      {isAsst && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "var(--a-accent)", color: "var(--a-on-accent)",
          display: "grid", placeItems: "center",
          flexShrink: 0,
        }}><IcChef size={14}/></div>
      )}
      <div style={{
        maxWidth: "84%",
        padding: "10px 14px",
        background: isAsst ? "var(--a-card)" : "var(--a-accent)",
        color: isAsst ? "var(--a-ink)" : "var(--a-on-accent)",
        border: isAsst ? "1px solid var(--a-line)" : "none",
        borderRadius: isAsst ? "2px 12px 12px 12px" : "12px 2px 12px 12px",
        fontFamily: "var(--f-serif)", fontSize: 15, lineHeight: 1.45,
      }}>
        {m.text}
        <div className="fmono mt-1" style={{ fontSize: 9.5, opacity: 0.5, letterSpacing: ".1em" }}>{m.ts}</div>
      </div>
    </div>
  );
};

const ToolBtn = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: "6px 12px",
    border: `1px solid ${active ? "var(--a-accent)" : "var(--a-line)"}`,
    background: active ? "rgba(232,154,42,.12)" : "transparent",
    color: active ? "var(--a-accent)" : "var(--a-ink)",
    borderRadius: 6,
    fontFamily: "var(--f-mono)", fontSize: 10.5, letterSpacing: ".08em", textTransform: "uppercase",
    display: "inline-flex", alignItems: "center", gap: 6,
  }}>{children}</button>
);

const QuickAsk = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    padding: "5px 12px", borderRadius: 999,
    border: "1px dashed var(--a-line)",
    color: "var(--a-ink)",
    background: "transparent",
    fontFamily: "var(--f-serif)", fontSize: 12, fontStyle: "italic",
  }}>{children}</button>
);

const SensorPill = ({ label, v, unit }) => (
  <div style={{
    padding: "6px 10px",
    background: "rgba(0,0,0,.55)",
    border: "1px solid var(--a-line)",
    borderRadius: 4,
    color: "var(--a-ink)",
  }}>
    <div className="fmono" style={{ fontSize: 9, letterSpacing: ".14em", color: "var(--a-accent)", textTransform: "uppercase" }}>{label}</div>
    <div className="fmono" style={{ fontSize: 13 }}>{v}{unit || ""}</div>
  </div>
);

export default function CookingScreen({ recipe }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [chat, setChat] = useState([
    { from: "asst", text: ASSISTANT_LINES[0].text, ts: "0:00" },
  ]);
  const [input, setInput] = useState("");
  const [voice, setVoice] = useState(false);
  const [cam, setCam] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const chatRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chat]);

  const steps = recipe.steps;
  const morph = steps.length > 1 ? stepIdx / (steps.length - 1) : 0;

  const advance = () => {
    setStepIdx(s => {
      if (s >= steps.length - 1) return s;
      const nx = s + 1;
      const line = ASSISTANT_LINES[nx];
      if (line) setChat(c => [...c, { from: "asst", text: line.text, ts: fmt(elapsed) }]);
      return nx;
    });
  };

  const back = () => setStepIdx(s => Math.max(0, s - 1));

  const sendMsg = () => {
    if (!input.trim()) return;
    const msg = input;
    setChat(c => [...c, { from: "user", text: msg, ts: fmt(elapsed) }]);
    setInput("");
    setTimeout(() => {
      setChat(c => [...c, { from: "asst", text: smartReply(msg, stepIdx), ts: fmt(elapsed) }]);
    }, 800);
  };

  const inkStyle = {
    "--morph": morph,
    "--a-ink":        morph < 0.45 ? "#2a241a" : "#fde9be",
    "--a-ink-soft":   morph < 0.45 ? "rgba(42,36,26,.7)" : "rgba(253,233,190,.78)",
    "--a-on-accent":  morph < 0.45 ? "#fbf6e9" : "#2a0e08",
    background: "var(--a-bg-1)",
    color: "var(--a-ink)",
    minHeight: "100vh",
    transition: "background .8s ease, color .35s ease",
  };

  return (
    <div className="assistant" style={inkStyle}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 36px", borderBottom: "1px solid var(--a-line)",
        background: "var(--a-bg-2)",
        transition: "background .8s ease, border-color .8s ease",
      }}>
        <div className="row gap-4">
          <div className="row gap-2">
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: "var(--a-accent-2)",
              animation: "pulse 1.6s ease-in-out infinite",
            }}/>
            <span className="fmono" style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--a-accent)" }}>Cooking live</span>
          </div>
          <div style={{ height: 16, width: 1, background: "var(--a-line)" }}/>
          <div className="fdisp" style={{ fontSize: 22, color: "var(--a-ink)" }}>{recipe.name}</div>
          <div className="caps" style={{ color: "var(--a-accent)" }}>step {stepIdx + 1} of {steps.length}</div>
        </div>
        <div className="row gap-3">
          <div className="row gap-2" style={{ color: "var(--a-ink)" }}>
            <IcClock size={14}/>
            <span className="fmono" style={{ fontSize: 13 }}>{fmt(elapsed)}</span>
          </div>
          <button onClick={() => setRunning(!running)} style={{
            padding: "6px 14px", border: "1px solid var(--a-line)",
            color: "var(--a-ink)", borderRadius: 6,
            fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase",
            background: "transparent",
          }}>
            {running ? <><IcPause size={11}/> Pause</> : <><IcPlay size={11}/> Resume</>}
          </button>
        </div>
      </div>

      {/* Main split */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 0, minHeight: "calc(100vh - 76px)" }}>
        {/* LEFT */}
        <div style={{ padding: "32px 36px", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Step focus card */}
          <div style={{
            background: "var(--a-card)", border: "1px solid var(--a-line)", borderRadius: 12, padding: 28,
            boxShadow: "0 18px 40px -20px rgba(0,0,0,.4)",
            transition: "background .6s ease, border-color .6s ease",
          }}>
            <div className="row between mb-3">
              <div className="row gap-3" style={{ alignItems: "baseline" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "var(--a-accent)", color: "var(--a-on-accent)",
                  display: "grid", placeItems: "center",
                  fontFamily: "var(--f-display)", fontSize: 24, fontWeight: 600,
                }}>{stepIdx + 1}</div>
                <div>
                  <div className="caps" style={{ color: "var(--a-accent)" }}>Now</div>
                  <h2 style={{ color: "var(--a-ink)", fontSize: 34, lineHeight: 1.1 }}>{steps[stepIdx].t}</h2>
                </div>
              </div>
              <div className="col" style={{ alignItems: "flex-end" }}>
                <div className="caps" style={{ color: "var(--a-accent)" }}>Time</div>
                <div className="fdisp" style={{ fontSize: 30, color: "var(--a-ink)" }}>{steps[stepIdx].min}<span style={{ fontSize: 14, marginLeft: 4, opacity: 0.7 }}>min</span></div>
              </div>
            </div>
            <p style={{ fontFamily: "var(--f-serif)", fontSize: 20, lineHeight: 1.5, color: "var(--a-ink)", opacity: 0.92 }}>{steps[stepIdx].body}</p>
            <div className="row gap-2 mt-4" style={{ paddingTop: 18, borderTop: "1px solid var(--a-line)" }}>
              <button onClick={back} disabled={stepIdx === 0} style={{
                padding: "12px 18px", borderRadius: 6, border: "1px solid var(--a-line)",
                color: "var(--a-ink)", background: "transparent", opacity: stepIdx === 0 ? 0.4 : 1,
                fontFamily: "var(--f-mono)", fontSize: 11.5, letterSpacing: ".1em", textTransform: "uppercase",
              }}>← Previous</button>
              <button onClick={advance} disabled={stepIdx >= steps.length - 1} style={{
                padding: "12px 22px", borderRadius: 6,
                background: "var(--a-accent)", color: "var(--a-on-accent)", border: "none",
                fontFamily: "var(--f-mono)", fontSize: 11.5, letterSpacing: ".1em", textTransform: "uppercase",
                fontWeight: 600, flex: 1,
                opacity: stepIdx >= steps.length - 1 ? 0.5 : 1,
              }}>✓ Mark complete &amp; next step</button>
            </div>
          </div>

          {/* Camera card */}
          <div style={{ background: "var(--a-card)", border: "1px solid var(--a-line)", borderRadius: 12, overflow: "hidden", transition: "background .6s ease, border-color .6s ease" }}>
            <div style={{
              aspectRatio: "16/9",
              background: "linear-gradient(135deg, rgba(0,0,0,.3), rgba(0,0,0,.6))",
              position: "relative",
            }}>
              <ImageSlot placeholder="cam · cooktop POV" style={{ width: "100%", height: "100%", opacity: cam ? 1 : 0.3, borderRadius: 0 }}/>
              <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 8 }}>
                <span style={{ padding: "5px 10px", borderRadius: 4, background: "rgba(0,0,0,.55)", color: "var(--a-accent)", fontFamily: "var(--f-mono)", fontSize: 10.5, letterSpacing: ".1em", border: "1px solid var(--a-accent)" }}>
                  ● REC · {fmt(elapsed)}
                </span>
                <span style={{ padding: "5px 10px", borderRadius: 4, background: "rgba(0,0,0,.55)", color: "var(--a-ink)", fontFamily: "var(--f-mono)", fontSize: 10.5, letterSpacing: ".1em" }}>
                  cam · cooktop
                </span>
              </div>
              <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{ padding: "10px 14px", background: "rgba(0,0,0,.7)", border: "1px solid var(--a-accent)", borderRadius: 6, color: "var(--a-ink)" }}>
                  <div className="fmono" style={{ fontSize: 9.5, letterSpacing: ".14em", color: "var(--a-accent)", textTransform: "uppercase" }}>Assistant sees</div>
                  <div style={{ fontFamily: "var(--f-serif)", fontSize: 15, fontStyle: "italic", marginTop: 4 }}>{seeingFor(stepIdx)}</div>
                </div>
                <div className="row gap-2">
                  <SensorPill label="Pan" v={Math.round(120 + stepIdx * 22)} unit="°C"/>
                  <SensorPill label="Audio" v="crackle"/>
                </div>
              </div>
            </div>
            <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--a-line)" }}>
              <div className="row gap-2">
                <ToolBtn active={cam}   onClick={() => setCam(!cam)}><IcVideo size={14}/> Camera</ToolBtn>
                <ToolBtn active={voice} onClick={() => setVoice(!voice)}><IcMic size={14}/> Voice {voice ? "on" : "off"}</ToolBtn>
                <ToolBtn><IcCamera size={14}/> Snap</ToolBtn>
              </div>
              <div className="fmono" style={{ fontSize: 11, color: "var(--a-ink)", opacity: 0.7, letterSpacing: ".1em", textTransform: "uppercase" }}>
                Vision · Audio · Voice
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ borderLeft: "1px solid var(--a-line)", background: "var(--a-bg-2)", display: "flex", flexDirection: "column", transition: "all .8s ease" }}>
          <CuisineHeader morph={morph}/>

          {/* Step rail */}
          <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--a-line)", overflow: "hidden" }}>
            <div className="row gap-2" style={{ overflowX: "auto", paddingBottom: 4 }}>
              {steps.map((s, i) => (
                <div key={i} onClick={() => setStepIdx(i)} className="col gap-1" style={{
                  flexShrink: 0, padding: "7px 11px", borderRadius: 6,
                  border: "1px solid var(--a-line)",
                  background: i === stepIdx ? "var(--a-accent)" : i < stepIdx ? "rgba(255,255,255,.06)" : "transparent",
                  color: i === stepIdx ? "var(--a-on-accent)" : "var(--a-ink)",
                  opacity: i < stepIdx ? 0.65 : 1,
                  cursor: "pointer", minWidth: 78, maxWidth: 110,
                }}>
                  <div className="fmono" style={{ fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {i < stepIdx ? "✓ done" : `Step ${i + 1}`}
                  </div>
                  <div style={{ fontFamily: "var(--f-serif)", fontSize: 12.5, lineHeight: 1.15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.t}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div ref={chatRef} style={{ flex: 1, padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
            {chat.map((m, i) => <ChatMsg key={i} m={m}/>)}
          </div>

          {/* Input */}
          <div style={{ padding: 16, borderTop: "1px solid var(--a-line)" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 8px 8px 14px", background: "var(--a-card)", borderRadius: 10, border: "1px solid var(--a-line)" }}>
              <IcMessage size={14} style={{ color: "var(--a-accent)" }}/>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMsg()}
                placeholder="Ask the assistant — or just talk"
                style={{ flex: 1, border: "none", background: "transparent", color: "var(--a-ink)", fontFamily: "var(--f-serif)", fontSize: 15, outline: "none" }}/>
              {voice && (
                <div className="row gap-1" style={{ color: "var(--a-accent)" }}>
                  <IcWaveform size={16}/>
                  <span className="fmono" style={{ fontSize: 10.5 }}>listening…</span>
                </div>
              )}
              <button onClick={sendMsg} style={{ width: 32, height: 32, borderRadius: 6, background: "var(--a-accent)", color: "var(--a-on-accent)", display: "grid", placeItems: "center" }}>
                <IcArrow size={14}/>
              </button>
            </div>
            <div className="row gap-2 mt-2" style={{ flexWrap: "wrap" }}>
              <QuickAsk onClick={() => setInput("Is this onion deep enough yet?")}>Onion deep enough?</QuickAsk>
              <QuickAsk onClick={() => setInput("Substitute for saffron?")}>Saffron sub?</QuickAsk>
              <QuickAsk onClick={() => setInput("My rice looks mushy.")}>Rice mushy?</QuickAsk>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: .5; } }
      `}</style>
    </div>
  );
}
