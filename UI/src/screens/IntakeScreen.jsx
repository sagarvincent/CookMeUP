import { useState, useEffect, useRef, useMemo } from 'react';
import { RECIPES } from '../data/index';
import { IcMessage, IcMic, IcCamera, IcArrow, IcCheck } from '../components/Icons';
import { ImageSlot } from '../components/Shell';

const SUGGESTIONS = [
  "Comfort food for a rainy night",
  "Something with chicken and rice",
  "Quick weeknight pasta",
  "Use what's in my pantry",
  "Show me a Sunday biryani",
  "Light, fresh, under 400 kcal",
];

const RECENT = [
  { name: "Hyderabadi Chicken Biryani", id: "biryani" },
  { name: "Mushroom Risotto", id: "risotto" },
  { name: "Spiced Shakshuka", id: "shak" },
];

export default function IntakeScreen({ onPick, openDiscover }) {
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    const part = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
    const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" });
    return `Good ${part} · ${date}`;
  }, []);

  const [mode, setMode] = useState("type");
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [photoDropped, setPhotoDropped] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [pulse, setPulse] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!listening) return;
    const id = setInterval(() => setPulse(p => p + 1), 120);
    return () => clearInterval(id);
  }, [listening]);

  const submit = (q) => {
    if (!q?.length) return;
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      const lower = q.toLowerCase();
      const match = RECIPES.find(r =>
        r.name.toLowerCase().includes(lower) ||
        lower.split(/\s+/).some(t => t.length > 2 && r.name.toLowerCase().includes(t)) ||
        lower.split(/\s+/).some(t => t.length > 2 && r.ingredients.some(i => i.name.toLowerCase().includes(t)))
      ) || RECIPES.find(r => r.id === "biryani");
      onPick(match);
    }, 900);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `
        radial-gradient(1200px 600px at 80% -20%, rgba(201,138,42,.12), transparent 60%),
        radial-gradient(900px 500px at -10% 110%, rgba(107,122,63,.1), transparent 70%),
        var(--paper)
      `,
      display: "flex", flexDirection: "column",
    }}>
      {/* Top bar */}
      <div className="row between" style={{
        padding: "22px 36px",
        borderBottom: "1px solid rgba(201,185,148,.4)",
      }}>
        <div className="row" style={{ alignItems: "baseline", gap: 8 }}>
          <div className="brand-mark">Mise<span className="amp"> &amp; </span>Plate</div>
          <div className="brand-sub" style={{ marginLeft: 4 }}>Recipes · Pantry · Cook</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={openDiscover}>
          Browse the cookbook
        </button>
      </div>

      {/* Centered intake */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "20px 24px 80px", maxWidth: 900, margin: "0 auto", width: "100%",
      }}>
        <div className="center" style={{ marginBottom: 36 }}>
          <div className="eyebrow" style={{ display: "inline-block" }}>{greeting}</div>
          <h1 style={{ fontSize: 72, lineHeight: 1.05, marginTop: 12 }}>
            What shall we
            <span style={{ fontStyle: "italic", color: "var(--brick)" }}> cook</span>
            <span style={{ color: "var(--ink-3)" }}>?</span>
          </h1>
          <p className="serif-it mt-3" style={{ fontSize: 19, color: "var(--ink-2)", maxWidth: 520, margin: "16px auto 0" }}>
            Tell me what you're hungry for — by voice, in words, or with a picture you saw somewhere.
          </p>
        </div>

        <div className="card" style={{ width: "100%", maxWidth: 720, padding: 0, overflow: "hidden", boxShadow: "var(--shadow-3)" }}>
          {/* Tab bar */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid var(--line-soft)" }}>
            {[
              { id: "type",  label: "Type",  icon: IcMessage, sub: "Describe in words" },
              { id: "speak", label: "Speak", icon: IcMic,     sub: "Tell me out loud" },
              { id: "photo", label: "Photo", icon: IcCamera,  sub: "Show me a picture" },
            ].map((m, i) => (
              <button key={m.id} onClick={() => setMode(m.id)} style={{
                padding: "18px 14px",
                background: mode === m.id ? "var(--paper)" : "transparent",
                borderRight: i < 2 ? "1px solid var(--line-soft)" : "none",
                borderBottom: mode === m.id ? "2px solid var(--brick)" : "2px solid transparent",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                color: mode === m.id ? "var(--ink)" : "var(--ink-3)",
                transition: "all .15s var(--tap)",
              }}>
                <m.icon size={20} stroke={mode === m.id ? "var(--brick)" : "currentColor"}/>
                <span className="fdisp" style={{ fontSize: 18, lineHeight: 1 }}>{m.label}</span>
                <span className="serif-it" style={{ fontSize: 12, color: "var(--ink-3)", fontStyle: "italic" }}>{m.sub}</span>
              </button>
            ))}
          </div>

          {/* Mode body */}
          <div style={{ padding: 28 }}>
            {mode === "type" && (
              <div>
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "14px 16px",
                  background: "var(--paper)",
                  border: "1px solid var(--line-soft)",
                  borderRadius: 10,
                  minHeight: 90,
                }}>
                  <IcMessage size={18} style={{ color: "var(--ink-3)", marginTop: 4 }}/>
                  <textarea ref={inputRef} value={text} onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(text); } }}
                    placeholder="e.g. something cosy with rice, not too spicy…"
                    style={{
                      flex: 1, border: "none", background: "transparent", outline: "none",
                      fontFamily: "var(--f-serif)", fontSize: 18, lineHeight: 1.45,
                      color: "var(--ink)", resize: "none",
                      minHeight: 60,
                    }}/>
                </div>
                <div className="row between mt-3">
                  <div className="serif-it" style={{ color: "var(--ink-3)", fontSize: 13 }}>
                    Press <span className="fmono" style={{ background: "var(--paper-2)", padding: "1px 6px", borderRadius: 3, fontSize: 11 }}>Enter</span> to send
                  </div>
                  <button className="btn btn-brick" onClick={() => submit(text)} disabled={!text.trim()}
                    style={{ opacity: text.trim() ? 1 : 0.4 }}>
                    Find a recipe <IcArrow size={13}/>
                  </button>
                </div>
              </div>
            )}

            {mode === "speak" && (
              <div className="col" style={{ alignItems: "center", gap: 18, padding: "10px 0" }}>
                <button onClick={() => setListening(!listening)} style={{
                  width: 120, height: 120, borderRadius: "50%",
                  background: listening ? "var(--brick)" : "var(--cream-card)",
                  border: `2px solid ${listening ? "var(--brick)" : "var(--line)"}`,
                  color: listening ? "var(--paper)" : "var(--brick)",
                  display: "grid", placeItems: "center",
                  position: "relative",
                  transition: "all .2s var(--tap)",
                  boxShadow: listening ? "0 0 0 14px rgba(160,68,52,.15), 0 0 0 28px rgba(160,68,52,.06)" : "var(--shadow-2)",
                }}>
                  <IcMic size={42} stroke="currentColor"/>
                </button>
                <div className="center">
                  <div className="fdisp" style={{ fontSize: 24 }}>{listening ? "Listening…" : "Tap to speak"}</div>
                  <div className="serif-it mt-1" style={{ color: "var(--ink-3)" }}>
                    {listening ? "Say what you want to cook tonight" : "I'll wait until you stop talking"}
                  </div>
                </div>
                {listening && (
                  <div className="row gap-1" style={{ height: 28, alignItems: "center" }}>
                    {Array.from({ length: 24 }).map((_, i) => {
                      const h = 6 + Math.abs(Math.sin((pulse + i * 0.4) * 0.5)) * 18;
                      return <div key={i} style={{ width: 3, height: h, background: "var(--brick)", borderRadius: 2, transition: "height .12s linear" }}/>;
                    })}
                  </div>
                )}
                <div className="row gap-2 mt-2">
                  <button className="btn btn-ghost btn-sm" onClick={() => setListening(false)}>Cancel</button>
                  {listening && (
                    <button className="btn btn-brick btn-sm" onClick={() => { setListening(false); submit("biryani"); }}>
                      Stop &amp; send
                    </button>
                  )}
                </div>
              </div>
            )}

            {mode === "photo" && (
              <div>
                <label onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); setPhotoDropped(true); }}
                  style={{
                    display: "block",
                    border: "2px dashed var(--line)",
                    borderRadius: 10,
                    padding: "32px 20px",
                    textAlign: "center",
                    background: photoDropped ? "rgba(107,122,63,.08)" : "var(--paper)",
                    cursor: "pointer",
                    transition: "background .15s var(--tap)",
                  }}>
                  <div style={{
                    width: 64, height: 64, margin: "0 auto",
                    background: photoDropped ? "rgba(107,122,63,.18)" : "var(--paper-2)",
                    borderRadius: "50%", display: "grid", placeItems: "center",
                    color: photoDropped ? "var(--forest)" : "var(--ink-3)",
                  }}>
                    {photoDropped ? <IcCheck size={26}/> : <IcCamera size={26}/>}
                  </div>
                  <div className="fdisp mt-3" style={{ fontSize: 22 }}>
                    {photoDropped ? "Got it — analysing…" : "Drop a photo here"}
                  </div>
                  <div className="serif-it mt-1" style={{ color: "var(--ink-3)" }}>
                    {photoDropped ? "Spotted basmati, fried onions, saffron, chicken" : "or click to browse · jpg, png, heic"}
                  </div>
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={() => setPhotoDropped(true)}/>
                </label>
                {photoDropped && (
                  <div className="row between mt-3">
                    <button className="btn btn-ghost btn-sm" onClick={() => setPhotoDropped(false)}>Try another</button>
                    <button className="btn btn-brick" onClick={() => submit("biryani")}>
                      Cook this dish <IcArrow size={13}/>
                    </button>
                  </div>
                )}
              </div>
            )}

            {thinking && (
              <div className="row gap-3 mt-4" style={{
                padding: "12px 16px",
                background: "rgba(201,138,42,.12)",
                border: "1px solid rgba(201,138,42,.3)",
                borderRadius: 8,
                color: "var(--saffron-acc)",
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: "50%",
                  border: "2px solid var(--saffron-acc)",
                  borderTopColor: "transparent",
                  animation: "spin 0.8s linear infinite",
                }}/>
                <span className="serif-it">Reading the pantry, the calendar, your spice tolerance…</span>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div style={{ background: "var(--paper)", borderTop: "1px solid var(--line-soft)", padding: "16px 20px" }}>
            <div className="caps mb-2" style={{ color: "var(--ink-3)" }}>Try one of these</div>
            <div className="row gap-2" style={{ flexWrap: "wrap" }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => { setMode("type"); setText(s); }}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid var(--line-soft)",
                    background: "var(--cream-card)",
                    borderRadius: 999,
                    fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: 13.5,
                    color: "var(--ink-2)",
                    transition: "all .12s var(--tap)",
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent meals */}
        <div className="mt-6" style={{ width: "100%", maxWidth: 720 }}>
          <div className="row between mb-2">
            <div className="caps">Recently cooked</div>
            <button onClick={openDiscover} className="fmono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: ".1em", textTransform: "uppercase" }}>
              See all →
            </button>
          </div>
          <div className="row gap-3">
            {RECENT.map(rc => {
              const recipe = RECIPES.find(r => r.id === rc.id);
              return (
                <button key={rc.id} onClick={() => onPick(recipe)} className="card" style={{
                  flex: 1, padding: 12,
                  display: "flex", gap: 12, alignItems: "center",
                  textAlign: "left", cursor: "pointer",
                }}>
                  <ImageSlot placeholder={rc.name} style={{ width: 48, height: 48, borderRadius: 6, flexShrink: 0 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--f-serif)", fontSize: 14, lineHeight: 1.2 }}>{rc.name}</div>
                    <div className="fmono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: ".08em" }}>
                      {recipe.time}m · {recipe.macros.kcal} kcal
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
