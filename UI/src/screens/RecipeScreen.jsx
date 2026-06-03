import { useState, useMemo } from 'react';
import { INVENTORY, CUISINES } from '../data/index';
import {
  IcClock, IcUsers, IcFlame, IcStar, IcHeart, IcEdit,
  IcArrow, IcSparkle, IcBag, IcMinus, IcPlus,
} from '../components/Icons';
import { PageHeader, Slider, MacroRow, Stamp, ImageSlot } from '../components/Shell';

const scaleRecipe = (r, kcalTarget, oilLvl, spiceLvl) => {
  const ratio = kcalTarget / r.macros.kcal;
  const oilRatio = oilLvl / r.oil;
  const ings = r.ingredients.map(i => {
    let q = i.qty * ratio;
    if (/oil|ghee|butter|lard/i.test(i.name)) q = i.qty * oilRatio;
    return { ...i, qty: Math.round(q * 100) / 100 };
  });
  const macros = {
    kcal:    Math.round(r.macros.kcal * ratio),
    protein: Math.round(r.macros.protein * ratio),
    carbs:   Math.round(r.macros.carbs * ratio),
    fat:     Math.round(r.macros.fat * (oilRatio * 0.6 + ratio * 0.4)),
    fiber:   Math.round(r.macros.fiber * ratio),
  };
  return { ings, macros };
};

const Stat = ({ label, v, icon: Icon }) => (
  <div className="col gap-1" style={{ minWidth: 90 }}>
    <div className="row gap-2" style={{ color: "var(--ink-3)" }}><Icon size={14}/><span className="caps">{label}</span></div>
    <div className="fdisp" style={{ fontSize: 26, color: "var(--ink)", whiteSpace: "nowrap" }}>{v}</div>
  </div>
);

const MacroBig = ({ label, v, u, c }) => (
  <div className="col" style={{ gap: 2, alignItems: "baseline" }}>
    <div className="fmono" style={{ fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-3)" }}>{label}</div>
    <div style={{ fontFamily: "var(--f-display)", fontSize: 38, lineHeight: 1, color: c }}>
      {v}<span className="fmono" style={{ fontSize: 13, color: "var(--ink-3)", marginLeft: 4 }}>{u}</span>
    </div>
  </div>
);

const InventoryCheck = ({ recipe, scaledIngs }) => {
  const checks = scaledIngs.map(ing => {
    const inv = INVENTORY.find(x => x.name.toLowerCase() === ing.name.toLowerCase());
    const have = inv ? inv.qty : 0;
    const need = ing.qty;
    const short = Math.max(0, need - have);
    return { ...ing, have, short, ok: short <= 0 };
  });
  const missing = checks.filter(c => !c.ok);
  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="row between mb-3">
        <div>
          <div className="eyebrow">Pantry crosscheck</div>
          <h3 className="mt-1">{missing.length === 0 ? "Everything's on the shelf" : `Short on ${missing.length} item${missing.length > 1 ? "s" : ""}`}</h3>
        </div>
        {missing.length === 0 ? <Stamp tone="olive">Ready to cook</Stamp> : <Stamp tone="brick">Shop the gap</Stamp>}
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th style={{ textAlign: "right" }}>Needed</th>
            <th style={{ textAlign: "right" }}>On hand</th>
            <th style={{ textAlign: "right" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {checks.map(c => (
            <tr key={c.name}>
              <td style={{ fontFamily: "var(--f-serif)", fontSize: 15.5 }}>{c.name}</td>
              <td style={{ textAlign: "right" }} className="fmono">{c.qty} {c.unit}</td>
              <td style={{ textAlign: "right", color: "var(--ink-3)" }} className="fmono">{c.have} {c.unit}</td>
              <td style={{ textAlign: "right" }}>
                {c.ok
                  ? <span className="chip">✓ have</span>
                  : <span className="chip chip-brick">need {Math.round(c.short * 100) / 100} {c.unit}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {missing.length > 0 && (
        <div className="row between mt-4" style={{ paddingTop: 14, borderTop: "1px solid var(--line-soft)" }}>
          <div className="serif-it" style={{ color: "var(--ink-3)" }}>
            We've added {missing.length} item{missing.length > 1 ? "s" : ""} to your shopping list.
          </div>
          <button className="btn btn-ghost"><IcBag size={14}/> Open list</button>
        </div>
      )}
    </div>
  );
};

const StepEditor = ({ steps, spiceLvl, oilLvl, kcalScale }) => {
  const annotations = steps.map((s, i) => {
    if (i === 0 && spiceLvl < 4) return "Cut chili in half; deseed.";
    if (i === 0 && spiceLvl > 7) return "Add ½ tsp Kashmiri chili to marinade.";
    if (i === 1 && oilLvl < 4) return `Reduce ghee to ${Math.round(oilLvl * 0.5)} tbsp; pan-toast instead of deep frying onions.`;
    if (i === 1 && oilLvl > 7) return "Use full ghee + 1 tbsp neutral oil for crispier birista.";
    if (i === 4 && kcalScale < 0.85) return "Skip the extra ghee drizzle when layering.";
    return null;
  });
  return (
    <div className="col gap-3">
      {steps.map((s, i) => (
        <div key={i} className="card" style={{ padding: 18, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "flex-start" }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "var(--paper)", border: "1px solid var(--line)",
            display: "grid", placeItems: "center",
            fontFamily: "var(--f-display)", fontSize: 19, color: "var(--brick)",
          }}>{i + 1}</div>
          <div style={{ minWidth: 0 }}>
            <div className="row between" style={{ alignItems: "baseline", gap: 12 }}>
              <h4 style={{ flex: 1 }}>{s.t}</h4>
              <span className="caps" style={{ whiteSpace: "nowrap" }}>{s.min} min</span>
            </div>
            <div className="serif-it mt-1" style={{ fontSize: 15.5, color: "var(--ink-2)", lineHeight: 1.55 }}>{s.body}</div>
            {annotations[i] && (
              <div className="mt-2 row gap-2" style={{
                padding: "8px 12px", background: "rgba(201,138,42,.1)",
                border: "1px dashed rgba(201,138,42,.4)", borderRadius: 6,
                color: "var(--saffron-acc)", fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: 14,
              }}>
                <IcSparkle size={13}/> Adjusted for you: {annotations[i]}
              </div>
            )}
          </div>
          <button className="row gap-1" style={{ color: "var(--ink-3)" }}><IcEdit size={14}/></button>
        </div>
      ))}
    </div>
  );
};

export default function RecipeScreen({ recipe, showNutrition, openCooking }) {
  const [kcal, setKcal] = useState(recipe.macros.kcal);
  const [oil, setOil] = useState(recipe.oil);
  const [spice, setSpice] = useState(recipe.spice);
  const [servings, setServings] = useState(recipe.servings);

  const { ings, macros } = useMemo(() => scaleRecipe(recipe, kcal, oil, spice), [recipe, kcal, oil, spice]);
  const cuisine = CUISINES.find(c => c.id === recipe.cuisine);

  return (
    <div className="main">
      {/* Recipe header */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 36, marginBottom: 36, alignItems: "stretch" }}>
        <div>
          <div className="row gap-2 mb-2">
            <span className="eyebrow">{cuisine?.label} · {recipe.course}</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--line)" }}/>
            <span className="eyebrow">Receipt no. {recipe.id.toUpperCase()}-47</span>
          </div>
          <h1 style={{ fontSize: 64, lineHeight: 1.02 }}>{recipe.name}</h1>
          <div className="serif-it mt-3" style={{ fontSize: 19, color: "var(--ink-2)", maxWidth: 560 }}>{recipe.tagline}</div>

          <div className="row gap-4 mt-5" style={{ paddingTop: 18, borderTop: "1px solid var(--line-soft)", borderBottom: "1px solid var(--line-soft)", paddingBottom: 18 }}>
            <Stat label="Time"       v={`${recipe.time} min`} icon={IcClock}/>
            <Stat label="Serves"     v={servings}             icon={IcUsers}/>
            <Stat label="Difficulty" v={recipe.difficulty}    icon={IcFlame}/>
            <Stat label="Rating"     v={`${recipe.rating} ★`} icon={IcStar}/>
          </div>

          <p className="mt-5" style={{ fontFamily: "var(--f-serif)", fontSize: 16, lineHeight: 1.65, color: "var(--ink-2)", maxWidth: 560 }}>
            <span className="fdisp" style={{ fontSize: 38, float: "left", lineHeight: 0.85, paddingRight: 8, color: "var(--brick)" }}>{recipe.history[0]}</span>
            {recipe.history.slice(1)}
          </p>

          <div className="row gap-2 mt-5">
            <button className="btn btn-brick btn-lg" onClick={openCooking}><IcFlame size={15}/> Start cooking</button>
            <button className="btn btn-ghost btn-lg"><IcHeart size={14}/> Save</button>
            <button className="btn btn-ghost btn-lg"><IcEdit size={14}/> Tweak</button>
          </div>
        </div>
        <div className="card" style={{ overflow: "hidden", minHeight: 480 }}>
          <ImageSlot placeholder={`${recipe.name} · plated`} style={{ width: "100%", height: "100%", borderRadius: 0 }}/>
        </div>
      </div>

      {/* Customization */}
      <div className="hr-fancy"><span>Make it yours</span></div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 28, padding: "24px 0 32px" }}>
        <Slider label="Calories per serving" value={kcal} min={250} max={900} step={10}
                onChange={setKcal} lo="light" hi="hearty" suffix=" kcal"/>
        <Slider label="Oil & fat" value={oil} min={0} max={10} onChange={setOil} lo="lean" hi="rich"/>
        <Slider label="Spice level" value={spice} min={0} max={10} onChange={setSpice} lo="mild" hi="fiery"/>
        <div className="slider-row">
          <div className="sh"><span>Servings</span><span className="sv fdisp">{servings}</span></div>
          <div className="row gap-2" style={{ background: "var(--paper)", border: "1px solid var(--line-soft)", borderRadius: 6, padding: 4 }}>
            <button className="btn-ghost btn btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => setServings(Math.max(1, servings - 1))}><IcMinus size={12}/></button>
            <button className="btn-ghost btn btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => setServings(servings + 1)}><IcPlus size={12}/></button>
          </div>
          <div className="ticks" style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: 9.5, color: "var(--ink-3)" }}>
            <span>1 plate</span><span>family</span>
          </div>
        </div>
      </div>

      {/* Macros card */}
      {showNutrition && (
        <div className="card mb-6" style={{ padding: 24, display: "grid", gridTemplateColumns: "auto 1fr", gap: 28, alignItems: "center" }}>
          <div>
            <div className="eyebrow">After your tweaks</div>
            <h3 className="mt-1">Nutrition · per serving</h3>
          </div>
          <div className="row gap-5" style={{ flexWrap: "wrap" }}>
            <MacroBig label="Calories" v={macros.kcal}    u="kcal" c="var(--brick)"/>
            <MacroBig label="Protein"  v={macros.protein} u="g"    c="var(--forest)"/>
            <MacroBig label="Carbs"    v={macros.carbs}   u="g"    c="var(--saffron-acc)"/>
            <MacroBig label="Fat"      v={macros.fat}     u="g"    c="var(--walnut)"/>
            <MacroBig label="Fiber"    v={macros.fiber}   u="g"    c="var(--olive)"/>
          </div>
        </div>
      )}

      {/* Ingredients + inventory */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 28, marginBottom: 36 }}>
        <div className="card" style={{ padding: 24 }}>
          <div className="eyebrow">Mise en place</div>
          <h3 className="mt-1 mb-3">For {servings} servings</h3>
          <div className="col gap-2">
            {ings.map((ing, i) => (
              <div key={i} className="row between" style={{ paddingBottom: 8, borderBottom: i < ings.length - 1 ? "1px dashed var(--line-soft)" : "none" }}>
                <div style={{ fontFamily: "var(--f-serif)", fontSize: 15.5 }}>{ing.name}</div>
                <div className="fmono" style={{ color: "var(--ink-3)" }}>{ing.qty} {ing.unit}</div>
              </div>
            ))}
          </div>
        </div>
        <InventoryCheck recipe={recipe} scaledIngs={ings}/>
      </div>

      {/* Method */}
      {recipe.steps.length > 0 && (
        <>
          <div className="hr-fancy"><span>The method</span></div>
          <div className="mt-5 mb-5">
            <StepEditor steps={recipe.steps} spiceLvl={spice} oilLvl={oil} kcalScale={kcal / recipe.macros.kcal}/>
          </div>
        </>
      )}

      <div className="card" style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="eyebrow">When you're ready</div>
          <h3 className="mt-1">Hand the pan to your cooking assistant</h3>
          <div className="serif-it mt-1" style={{ color: "var(--ink-3)" }}>Live voice + camera coaching. Theme shifts with the cuisine as you cook.</div>
        </div>
        <button className="btn btn-brick btn-lg" onClick={openCooking}><IcFlame size={15}/> Start cooking</button>
      </div>
    </div>
  );
}
