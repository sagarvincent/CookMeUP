import { useRef } from 'react';
import {
  IcSparkle, IcHome, IcBook, IcLeaf, IcBag, IcCal, IcFlame,
  IcChef, IcSliders, IcArrow,
} from './Icons';

export const BrandMark = () => (
  <div className="brand">
    <div>
      <div className="brand-mark">Mise<span className="amp"> &amp; </span>Plate</div>
      <div className="brand-sub">Recipes · Pantry · Cook</div>
    </div>
  </div>
);

const NAV = [
  { id: "intake",    label: "Start",          icon: IcSparkle },
  { id: "home",      label: "Discover",       icon: IcHome },
  { id: "recipe",    label: "Today's Recipe", icon: IcBook },
  { id: "inventory", label: "Pantry",         icon: IcLeaf },
  { id: "shopping",  label: "Shopping List",  icon: IcBag, badge: 4 },
  { id: "dietplan",  label: "Diet Plan",      icon: IcCal },
  { id: "cooking",   label: "Cook Live",      icon: IcFlame },
  { id: "profile",   label: "Dish Profile",   icon: IcChef },
  { id: "onboard",   label: "Preferences",    icon: IcSliders },
];

export const Sidebar = ({ route, setRoute }) => (
  <aside className="sidebar">
    <BrandMark />
    <div className="caps nav-sect">Cookbook</div>
    {NAV.slice(0, 6).map(n => (
      <button key={n.id} className={"nav-item" + (route === n.id ? " active" : "")}
              onClick={() => setRoute(n.id)}>
        <n.icon />
        <span>{n.label}</span>
        {n.badge ? <span className="badge">{n.badge}</span> : null}
      </button>
    ))}
    <div className="caps nav-sect">Kitchen</div>
    {NAV.slice(6).map(n => (
      <button key={n.id} className={"nav-item" + (route === n.id ? " active" : "")}
              onClick={() => setRoute(n.id)}>
        <n.icon />
        <span>{n.label}</span>
      </button>
    ))}
    <div style={{ flex: 1 }} />
    <div className="card-soft" style={{ padding: 12, fontSize: 12, color: "var(--ink-3)", fontFamily: "var(--f-serif)", fontStyle: "italic" }}>
      "A receipt is a discipline, but a kitchen is a conversation."
      <div className="fmono mt-2" style={{ fontSize: 9.5, letterSpacing: ".14em", textTransform: "uppercase", fontStyle: "normal" }}>
        — House motto, 1912
      </div>
    </div>
  </aside>
);

export const PageHeader = ({ eyebrow, title, sub, actions }) => (
  <div className="page-h">
    <div>
      {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
      <h1 className="mt-2">{title}</h1>
      {sub ? <div className="sub">{sub}</div> : null}
    </div>
    {actions ? <div className="row gap-2">{actions}</div> : null}
  </div>
);

export const Slider = ({ value, min = 0, max = 10, step = 1, onChange,
                         label, suffix = "", lo = "low", hi = "high", showValue = true }) => {
  const pct = ((value - min) / (max - min)) * 100;
  const trackRef = useRef(null);
  const drag = (e) => {
    const r = trackRef.current.getBoundingClientRect();
    const move = (ev) => {
      const x = (ev.clientX ?? ev.touches?.[0]?.clientX) - r.left;
      const ratio = Math.max(0, Math.min(1, x / r.width));
      const raw = min + ratio * (max - min);
      const stepped = Math.round(raw / step) * step;
      onChange(Math.max(min, Math.min(max, stepped)));
    };
    move(e);
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };
  return (
    <div className="slider-row">
      <div className="sh">
        <span>{label}</span>
        {showValue ? <span className="sv fdisp">{value}{suffix}</span> : null}
      </div>
      <div className="track" ref={trackRef} onMouseDown={drag}>
        <div className="fill" style={{ width: pct + "%" }} />
        <div className="knob" style={{ left: pct + "%" }} />
      </div>
      <div className="ticks">
        <span>{lo}</span>
        <span>{hi}</span>
      </div>
    </div>
  );
};

export const ChipToggle = ({ active, children, onClick, tone = "olive" }) => {
  const map = {
    olive: { bg: "rgba(107,122,63,.12)", b: "rgba(107,122,63,.3)", c: "var(--forest)" },
    brick: { bg: "rgba(160,68,52,.12)", b: "rgba(160,68,52,.3)", c: "var(--brick)" },
  };
  const t = map[tone] || map.olive;
  return (
    <button onClick={onClick}
      style={{
        padding: "6px 12px", borderRadius: 999,
        border: `1px solid ${active ? t.b : "var(--line-soft)"}`,
        background: active ? t.bg : "transparent",
        color: active ? t.c : "var(--ink-3)",
        fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase",
        transition: "all .12s var(--tap)",
      }}>
      {children}
    </button>
  );
};

export const MacroRow = ({ macros, show = true, compact = false }) => {
  if (!show) return null;
  const items = [
    { k: "kcal",    l: "kcal", c: "var(--brick)" },
    { k: "protein", l: "P",    c: "var(--forest)" },
    { k: "carbs",   l: "C",    c: "var(--saffron-acc)" },
    { k: "fat",     l: "F",    c: "var(--walnut)" },
    { k: "fiber",   l: "fib",  c: "var(--olive)" },
  ];
  return (
    <div className="row gap-3" style={{ fontFamily: "var(--f-mono)", fontSize: compact ? 10.5 : 11.5, color: "var(--ink-3)" }}>
      {items.map(i => (
        <span key={i.k} style={{ display: "inline-flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ color: i.c, fontWeight: 600 }}>{macros[i.k]}{i.k === "kcal" ? "" : "g"}</span>
          <span style={{ fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase" }}>{i.l}</span>
        </span>
      ))}
    </div>
  );
};

export const Stamp = ({ children, tone = "brick" }) => {
  const tones = {
    brick:  { c: "var(--brick)",  bg: "rgba(160,68,52,.05)" },
    olive:  { c: "var(--forest)", bg: "rgba(107,122,63,.05)" },
    walnut: { c: "var(--walnut)", bg: "rgba(106,74,46,.05)" },
  };
  const t = tones[tone] || tones.brick;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "6px 12px",
      border: `1.5px solid ${t.c}`,
      color: t.c, background: t.bg,
      fontFamily: "var(--f-mono)", fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase",
      borderRadius: 2,
      transform: "rotate(-1deg)",
    }}>{children}</div>
  );
};

// Image placeholder component replacing the image-slot web component
export const ImageSlot = ({ placeholder, style, className }) => (
  <div
    className={className}
    style={{
      background: "linear-gradient(135deg, var(--paper-2), var(--paper-3))",
      display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: "var(--rad-3)",
      overflow: "hidden",
      ...style,
    }}
  >
    <span style={{
      fontFamily: "var(--f-serif)", fontSize: 12, fontStyle: "italic",
      color: "var(--muted)", textAlign: "center", padding: "8px 12px",
      maxWidth: "90%",
    }}>{placeholder}</span>
  </div>
);
