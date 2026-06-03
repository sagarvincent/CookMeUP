import { useState } from 'react';
import {
  IcFlame, IcHeart, IcClock, IcEdit, IcCheck,
  StarRow,
} from '../shared/Icons.jsx';
import { PageHeader, Slider, ChipToggle, Stamp, ImageSlot } from '../shared/Shell.jsx';

// ─────────────────────── ProfStat ─────────────── START ──────────────────
// calls:     none (presentational)
// called by: ProfileScreen
function ProfStat({ label, v, sub, c = "var(--ink)", icon: Icon, stars, last }) {
  return (
    <div className="col" style={{ padding: "0 16px", borderRight: last ? "none" : "1px solid var(--line-soft)" }}>
      <div className="caps">{label}</div>
      <div className="row gap-2 mt-2" style={{ alignItems: "baseline" }}>
        <div className="fdisp" style={{ fontSize: 30, lineHeight: 1, color: c }}>{v}</div>
        {Icon && <Icon size={14}/>}
      </div>
      {stars && <div className="mt-1"><StarRow value={v} size={11}/></div>}
      <div className="serif-it mt-1" style={{ fontSize: 12, color: "var(--ink-3)" }}>{sub}</div>
    </div>
  );
}
// ─────────────────────── ProfStat ─────────────── END ────────────────────

// ─────────────────────── ProfileScreen ─────────────── START ──────────────────
// calls:     none (presentational — receives recipe + cuisines as props)
// called by: L1/App
export function ProfileScreen({ recipe, cuisines }) {
  const r       = recipe;
  const cuisine = cuisines.find(c => c.id === r.cuisine);

  return (
    <div className="main">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 36, marginBottom: 36 }}>
        <div className="card" style={{ aspectRatio: "4/5", overflow: "hidden", position: "relative" }}>
          <ImageSlot placeholder={`${r.name} · portrait`} style={{ width: "100%", height: "100%", borderRadius: 0 }}/>
          <div style={{ position: "absolute", top: 18, left: 18 }}>
            <Stamp tone="brick">Volume IV · No. 47</Stamp>
          </div>
        </div>
        <div className="col" style={{ gap: 18 }}>
          <div>
            <div className="row gap-2 mb-2">
              <span className="eyebrow">{cuisine?.label} · {r.course}</span>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--line)" }}/>
              <span className="eyebrow">{r.diet}</span>
            </div>
            <h1 style={{ fontSize: 60, lineHeight: 1.02 }}>{r.name}</h1>
            <div className="serif-it mt-3" style={{ fontSize: 19, color: "var(--ink-2)", maxWidth: 540 }}>{r.tagline}</div>
          </div>
          <div className="card" style={{ padding: 22, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
            <ProfStat label="Rating" v={r.rating}                sub={`${r.ratings.toLocaleString()} reviews`} stars/>
            <ProfStat label="Likes"  v={r.likes.toLocaleString()}  sub="from the house"  icon={IcHeart} c="var(--brick)"/>
            <ProfStat label="Cooked" v={r.cooked.toLocaleString()} sub="this season"      icon={IcFlame} c="var(--saffron-acc)"/>
            <ProfStat label="Time"   v={`${r.time}m`}              sub={r.difficulty}     icon={IcClock} c="var(--forest)" last/>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <div className="eyebrow">A short history</div>
            <p className="mt-2" style={{ fontFamily: "var(--f-serif)", fontSize: 16, lineHeight: 1.6, color: "var(--ink-2)" }}>
              <span className="fdisp" style={{ fontSize: 36, float: "left", lineHeight: .85, paddingRight: 6, color: "var(--brick)" }}>{r.history[0]}</span>
              {r.history.slice(1)}
            </p>
          </div>
          <div className="row gap-2">
            <button className="btn btn-brick"><IcFlame size={14}/> Cook this</button>
            <button className="btn btn-ghost"><IcHeart size={14}/> Save</button>
            <button className="btn btn-ghost"><IcEdit size={14}/> Add notes</button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 28 }}>
        <div className="card" style={{ padding: 24 }}>
          <div className="eyebrow">Reception</div>
          <h3 className="mt-1 mb-4">{r.ratings.toLocaleString()} cooks rated it</h3>
          <div className="row gap-5" style={{ alignItems: "center" }}>
            <div className="col" style={{ alignItems: "center", gap: 4 }}>
              <div className="fdisp" style={{ fontSize: 72, lineHeight: 1, color: "var(--brick)" }}>{r.rating}</div>
              <StarRow value={r.rating} size={16}/>
              <div className="caps mt-1">out of 5</div>
            </div>
            <div className="col gap-2" style={{ flex: 1 }}>
              {[5,4,3,2,1].map(stars => {
                const pct = stars === 5 ? 78 : stars === 4 ? 16 : stars === 3 ? 4 : 1;
                return (
                  <div key={stars} className="row gap-2" style={{ alignItems: "center" }}>
                    <span className="fmono" style={{ fontSize: 11, color: "var(--ink-3)", width: 22 }}>{stars}★</span>
                    <div className="bar" style={{ flex: 1 }}><div style={{ width: pct + "%", background: stars >= 4 ? "var(--saffron-acc)" : "var(--ink-3)" }}/></div>
                    <span className="fmono" style={{ fontSize: 11, color: "var(--ink-3)", width: 32, textAlign: "right" }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <div className="eyebrow">Your cook history</div>
          <h3 className="mt-1 mb-4">5 times this year</h3>
          <div className="col gap-2">
            {[
              { date: "May 12", note: "Saffron substitute worked — turmeric milk gave it a softer color", rating: 5 },
              { date: "Apr 28", note: "Dum was 5 min long; bottom was a little dry", rating: 4 },
              { date: "Mar 14", note: "First time. Used full 4 onions; family said birista was the star", rating: 5 },
              { date: "Feb 02", note: "Pressure-cooker shortcut — fine but lost the layer texture", rating: 3 },
              { date: "Jan 10", note: "House dinner. Doubled servings, used 1.5x spice", rating: 5 },
            ].map((h, i) => (
              <div key={i} style={{ padding: "12px 0", borderBottom: i < 4 ? "1px dashed var(--line-soft)" : "none" }}>
                <div className="row between">
                  <div className="fmono" style={{ fontSize: 11, letterSpacing: ".1em", color: "var(--brick)", textTransform: "uppercase" }}>{h.date}</div>
                  <StarRow value={h.rating} size={11}/>
                </div>
                <div className="serif-it mt-1" style={{ fontSize: 14, color: "var(--ink-2)" }}>{h.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hr-fancy"><span>Notes from other cooks</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: 18 }}>
        {[
          { name: "Lena R.",  time: "2 days ago",  body: "I bloomed the saffron in warm milk for 20 minutes — the difference is night and day.", stars: 5 },
          { name: "Yusuf M.", time: "a week ago",   body: "Used a heavy cast-iron with a wet-cloth seal instead of foil. Smoke flavor was unreal.", stars: 5 },
          { name: "Priya S.", time: "this month",   body: "For half-spice version: deseed all chilis and use ½ tsp Kashmiri only. Still red, much gentler.", stars: 4 },
        ].map((n, i) => (
          <div key={i} className="card" style={{ padding: 20 }}>
            <div className="row between mb-2">
              <div className="row gap-2">
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--paper-3)", display: "grid", placeItems: "center", fontFamily: "var(--f-display)", fontSize: 14 }}>{n.name[0]}</div>
                <div>
                  <div style={{ fontFamily: "var(--f-serif)", fontSize: 14 }}>{n.name}</div>
                  <div className="fmono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: ".08em" }}>{n.time}</div>
                </div>
              </div>
              <StarRow value={n.stars} size={11}/>
            </div>
            <p style={{ fontFamily: "var(--f-serif)", fontSize: 15, lineHeight: 1.5, color: "var(--ink-2)", fontStyle: "italic" }}>"{n.body}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
// ─────────────────────── ProfileScreen ─────────────── END ────────────────────

// ─────────────────────── OnboardingScreen ─────────────── START ──────────────────
// calls:     none (self-contained UI with local pref state)
// called by: L1/App
export function OnboardingScreen({ cuisines }) {
  const [pref, setPref] = useState({ diet: "Non-Veg", allergies: [], skill: "Comfortable", targetKcal: 2100, spice: 5, cuisines: ["indian", "italian"], cookFreq: 4 });
  const tog = (k, v) => setPref({ ...pref, [k]: pref[k].includes(v) ? pref[k].filter(x => x !== v) : [...pref[k], v] });

  const Section = ({ n, title, children }) => (
    <div className="card" style={{ padding: 24, display: "grid", gridTemplateColumns: "48px 1fr", gap: 18 }}>
      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--paper)", border: "1px solid var(--line)", display: "grid", placeItems: "center", fontFamily: "var(--f-display)", fontSize: 19, color: "var(--brick)" }}>{n}</div>
      <div><h3>{title}</h3><div className="mt-3">{children}</div></div>
    </div>
  );

  return (
    <div className="main" style={{ maxWidth: 920, margin: "0 auto" }}>
      <PageHeader eyebrow="Welcome to the house" title={<>A short <span style={{ fontStyle: "italic", color: "var(--brick)" }}>introduction</span></>} sub="Tell us how you cook. Everything here can be changed later."/>
      <div className="col gap-4">
        <Section n={1} title="What do you eat?">
          <div className="row gap-2" style={{ flexWrap: "wrap" }}>
            {["Non-Veg","Veg","Vegan","Pescatarian"].map(d => <ChipToggle key={d} active={pref.diet === d} onClick={() => setPref({ ...pref, diet: d })} tone="brick">{d}</ChipToggle>)}
          </div>
          <div className="mt-4">
            <div className="caps mb-2">Allergies &amp; avoids</div>
            <div className="row gap-2" style={{ flexWrap: "wrap" }}>
              {["Peanut","Tree nut","Dairy","Gluten","Shellfish","Egg","Soy","None"].map(a => <ChipToggle key={a} active={pref.allergies.includes(a)} onClick={() => tog("allergies", a)}>{a}</ChipToggle>)}
            </div>
          </div>
        </Section>
        <Section n={2} title="How much do you cook?">
          <Slider label="Skill level" value={["New","Comfortable","Confident","Pro"].indexOf(pref.skill)} min={0} max={3} onChange={v => setPref({ ...pref, skill: ["New","Comfortable","Confident","Pro"][v] })} lo="just starting" hi="trained" showValue={false}/>
          <div className="mt-4">
            <Slider label="Sessions per week" value={pref.cookFreq} min={1} max={14} onChange={v => setPref({ ...pref, cookFreq: v })} lo="1×" hi="14×"/>
          </div>
        </Section>
        <Section n={3} title="The food itself">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            <Slider label="Calorie target (per day)" value={pref.targetKcal} min={1400} max={3200} step={50} onChange={v => setPref({ ...pref, targetKcal: v })} lo="cut" hi="bulk" suffix=" kcal"/>
            <Slider label="Default spice tolerance" value={pref.spice} min={0} max={10} onChange={v => setPref({ ...pref, spice: v })} lo="mild" hi="fiery"/>
          </div>
          <div className="mt-4">
            <div className="caps mb-2">Favourite cuisines</div>
            <div className="row gap-2" style={{ flexWrap: "wrap" }}>
              {cuisines.map(c => <ChipToggle key={c.id} active={pref.cuisines.includes(c.id)} onClick={() => tog("cuisines", c.id)}>{c.label}</ChipToggle>)}
            </div>
          </div>
        </Section>
        <Section n={4} title="The kitchen kit">
          <div className="row gap-2" style={{ flexWrap: "wrap" }}>
            {["Gas range","Induction","Oven","Pressure cooker","Air fryer","Wok","Cast iron","Stand mixer"].map(k => <ChipToggle key={k}>{k}</ChipToggle>)}
          </div>
        </Section>
        <div className="row gap-2 mt-4" style={{ justifyContent: "flex-end" }}>
          <button className="btn btn-ghost">Skip for now</button>
          <button className="btn btn-brick btn-lg">Save preferences <IcCheck size={14}/></button>
        </div>
      </div>
    </div>
  );
}
// ─────────────────────── OnboardingScreen ─────────────── END ────────────────────
