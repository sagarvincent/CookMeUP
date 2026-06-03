import { useDietPlan } from '../../layers/L2_business/useDietPlan.js';
import { DAYS, MEALS } from '../../layers/L3_composite/dietPlanOps.js';
import { IcWand, IcEdit, IcArrow, IcSparkle, IcX } from '../shared/Icons.jsx';
import { PageHeader, Slider, ChipToggle, MacroRow, ImageSlot } from '../shared/Shell.jsx';

const DAY_NAMES = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };

// ─────────────────────── MacroBar ─────────────── START ──────────────────
// calls:     none (presentational)
// called by: DietPlanScreen
function MacroBar({ label, v, tgt, unit, color }) {
  const pct  = Math.min(120, (v / tgt) * 100);
  const over = pct > 100;
  return (
    <div className="col gap-1">
      <div className="row between">
        <span className="caps" style={{ color: "var(--ink-3)" }}>{label}</span>
        <span className="fmono" style={{ fontSize: 12, color: over ? "var(--brick)" : "var(--ink)" }}>
          {Math.round(v)} <span style={{ color: "var(--ink-3)" }}>/ {tgt} {unit}</span>
        </span>
      </div>
      <div className="bar" style={{ position: "relative" }}>
        <div style={{ width: Math.min(100, pct) + "%", background: color }}/>
        {over && <div style={{ position: "absolute", top: 0, left: "100%", width: (pct - 100) + "%", maxWidth: "20%", height: "100%", background: "var(--brick)", opacity: 0.6, borderRadius: "0 999px 999px 0" }}/>}
      </div>
    </div>
  );
}
// ─────────────────────── MacroBar ─────────────── END ────────────────────

// ─────────────────────── DietPlanScreen ─────────────── START ──────────────────
// calls:     L2/useDietPlan: useDietPlan
// called by: L1/App
export default function DietPlanScreen({ plan, setPlan, recipes, dietTargets, openRecipe }) {
  const {
    activeDay, setActiveDay, picker, setPicker, targets, setTargets,
    todayTotals, weekKcal, avgKcal, changeRecipe,
  } = useDietPlan({ plan, setPlan, initialTargets: dietTargets });

  return (
    <div className="main">
      <PageHeader
        eyebrow="The week, plated"
        title={<>Diet <span style={{ fontStyle: "italic", color: "var(--forest)" }}>plan</span></>}
        sub="Drop dishes into the grid; macros adjust as you go. Targets live on the right."
        actions={<>
          <button className="btn btn-ghost"><IcWand size={14}/> Auto-fill week</button>
          <button className="btn">Send to calendar</button>
        </>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28 }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="row between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--line-soft)" }}>
            <div>
              <div className="caps">Week of May 18 — May 24</div>
              <h3 className="mt-1">{avgKcal} kcal / day avg</h3>
            </div>
            <div className="row gap-1" style={{ flexWrap: "wrap" }}>
              {DAYS.map((d, di) => {
                const k   = weekKcal[di];
                const onT = Math.abs(k - targets.kcal) < 250;
                return (
                  <button key={d} onClick={() => setActiveDay(d)} className="col" style={{ gap: 2, padding: "8px 14px", borderRadius: 6, background: d === activeDay ? "var(--ink)" : "transparent", color: d === activeDay ? "var(--paper)" : "var(--ink-2)", border: d === activeDay ? "1px solid var(--ink)" : "1px solid var(--line-soft)", alignItems: "center", minWidth: 56 }}>
                    <span className="fmono" style={{ fontSize: 10.5, letterSpacing: ".1em" }}>{d.toUpperCase()}</span>
                    <span className="fdisp" style={{ fontSize: 16, color: d === activeDay ? "var(--saffron-acc)" : onT ? "var(--forest)" : "var(--brick)" }}>{k}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ padding: 20 }}>
            <div className="eyebrow mb-3">{DAY_NAMES[activeDay]} · meal plan</div>
            <div className="col gap-3">
              {MEALS.map(m => {
                const r = plan[activeDay][m];
                return (
                  <div key={m} className="row gap-4" style={{ padding: 14, background: "var(--paper)", border: "1px solid var(--line-soft)", borderRadius: 8, alignItems: "center" }}>
                    <div style={{ width: 70, height: 70, borderRadius: 6, overflow: "hidden", background: "var(--paper-3)", flexShrink: 0 }}>
                      {r ? <ImageSlot placeholder={r.name} style={{ width: "100%", height: "100%", borderRadius: 0 }}/> : null}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="caps" style={{ color: "var(--brick)" }}>{m}</div>
                      {r ? (
                        <>
                          <div className="fdisp mt-1" style={{ fontSize: 22, lineHeight: 1.1 }}>{r.name}</div>
                          <div className="row gap-3 mt-2"><MacroRow macros={r.macros} compact/></div>
                        </>
                      ) : <div className="serif-it" style={{ color: "var(--ink-3)" }}>No meal scheduled</div>}
                    </div>
                    <div className="col gap-2">
                      <button className="btn btn-ghost btn-sm" onClick={() => setPicker({ day: activeDay, meal: m })}><IcEdit size={12}/> Change</button>
                      {r && <button className="btn btn-ghost btn-sm" onClick={() => openRecipe(r)}>Open <IcArrow size={11}/></button>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col gap-4">
          <div className="card" style={{ padding: 22 }}>
            <div className="eyebrow">Daily targets · {activeDay}</div>
            <h3 className="mt-1 mb-4">Macros</h3>
            <div className="col gap-4">
              <MacroBar label="Calories" v={todayTotals.kcal    || 0} tgt={targets.kcal}    unit="kcal" color="var(--brick)"/>
              <MacroBar label="Protein"  v={todayTotals.protein || 0} tgt={targets.protein} unit="g"    color="var(--forest)"/>
              <MacroBar label="Carbs"    v={todayTotals.carbs   || 0} tgt={targets.carbs}   unit="g"    color="var(--saffron-acc)"/>
              <MacroBar label="Fat"      v={todayTotals.fat     || 0} tgt={targets.fat}     unit="g"    color="var(--walnut)"/>
              <MacroBar label="Fiber"    v={todayTotals.fiber   || 0} tgt={targets.fiber}   unit="g"    color="var(--olive)"/>
            </div>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <div className="eyebrow mb-3">Adjust targets</div>
            <Slider label="Kcal / day"     value={targets.kcal}    min={1400} max={3200} step={50} onChange={v => setTargets({ ...targets, kcal: v })}    lo="cut"  hi="bulk" suffix=" kcal"/>
            <div className="mt-4">
              <Slider label="Protein g/day" value={targets.protein} min={60}   max={200}  step={5}  onChange={v => setTargets({ ...targets, protein: v })} lo="60g"  hi="200g"/>
            </div>
            <div className="row gap-2 mt-4" style={{ flexWrap: "wrap" }}>
              <ChipToggle active>High protein</ChipToggle>
              <ChipToggle>Low carb</ChipToggle>
              <ChipToggle>Mediterranean</ChipToggle>
              <ChipToggle tone="brick">Custom</ChipToggle>
            </div>
          </div>
          <div className="card-soft" style={{ padding: 18, background: "rgba(107,122,63,.08)", border: "1px solid rgba(107,122,63,.3)" }}>
            <div className="row gap-2" style={{ color: "var(--forest)" }}>
              <IcSparkle size={14}/>
              <div className="caps" style={{ color: "var(--forest)" }}>Pantry-aware tip</div>
            </div>
            <p className="serif-it mt-2" style={{ color: "var(--ink-2)", fontSize: 14, lineHeight: 1.5 }}>
              Friday's biryani uses 11 of your existing pantry items. We've pushed the prawn dish to Sunday to give you a market run window.
            </p>
          </div>
        </div>
      </div>

      {picker && (
        <div onClick={() => setPicker(null)} style={{ position: "fixed", inset: 0, background: "rgba(42,36,26,.55)", display: "grid", placeItems: "center", zIndex: 100 }}>
          <div className="card" onClick={e => e.stopPropagation()} style={{ padding: 24, width: 720, maxHeight: "78vh", overflow: "auto" }}>
            <div className="row between mb-3">
              <div>
                <div className="eyebrow">{picker.day} · {picker.meal}</div>
                <h3 className="mt-1">Pick a dish</h3>
              </div>
              <button onClick={() => setPicker(null)} className="row" style={{ color: "var(--ink-3)" }}><IcX size={16}/></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {recipes.map(r => (
                <button key={r.id} onClick={() => changeRecipe(picker.day, picker.meal, r)} className="col gap-2" style={{ padding: 12, border: "1px solid var(--line-soft)", borderRadius: 8, background: "var(--paper)", textAlign: "left" }}>
                  <ImageSlot placeholder={r.name} style={{ width: "100%", aspectRatio: "4/3", borderRadius: 6 }}/>
                  <div style={{ fontFamily: "var(--f-serif)", fontSize: 15, lineHeight: 1.2 }}>{r.name}</div>
                  <div className="fmono" style={{ fontSize: 10.5, color: "var(--ink-3)" }}>{r.macros.kcal} kcal · {r.time}m</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ─────────────────────── DietPlanScreen ─────────────── END ────────────────────
