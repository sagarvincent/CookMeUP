import { useHome } from '../../layers/L2_business/useHome.js';
import {
  IcClock, IcUsers, IcFlame, IcStar, IcHeart, IcSearch,
  IcGrid, IcList, IcFilter, IcArrow, IcWand, StarRow,
} from '../shared/Icons.jsx';
import { PageHeader, ChipToggle, MacroRow, Stamp, ImageSlot } from '../shared/Shell.jsx';

// ─────────────────────── RecipeCard ─────────────── START ──────────────────
// calls:     none (presentational)
// called by: HomeScreen
function RecipeCard({ r, onOpen, layout = "grid", showNutrition, cuisineLabel }) {
  if (layout === "row") {
    return (
      <div className="recipe-card" onClick={onOpen} style={{ flexDirection: "row", aspectRatio: "auto" }}>
        <div style={{ width: 200, flexShrink: 0 }}>
          <ImageSlot placeholder={r.name} style={{ width: "100%", height: "100%" }}/>
        </div>
        <div className="body" style={{ flex: 1, padding: 18 }}>
          <div className="row between">
            <div className="eyebrow">{cuisineLabel} · {r.course}</div>
            <span className="rating"><IcStar size={12}/> {r.rating}</span>
          </div>
          <div className="title">{r.name}</div>
          <div className="serif-it" style={{ fontSize: 14, color: "var(--ink-3)" }}>{r.tagline}</div>
          <div className="row gap-3 mt-2" style={{ color: "var(--ink-3)", fontSize: 12.5 }}>
            <span className="row gap-1"><IcClock size={13}/> {r.time}m</span>
            <span className="dot"/>
            <span className="row gap-1"><IcUsers size={13}/> {r.servings}</span>
            <span className="dot"/>
            <span>{r.difficulty}</span>
          </div>
          {showNutrition && <div className="mt-3"><MacroRow macros={r.macros} compact/></div>}
        </div>
      </div>
    );
  }
  return (
    <div className="recipe-card" onClick={onOpen}>
      <div className="img-wrap">
        <ImageSlot placeholder={r.name} style={{ width: "100%", height: "100%", borderRadius: 0 }}/>
        <div className="badges">
          <span className="chip">{cuisineLabel}</span>
          {r.diet === "Veg"   ? <span className="chip">Veg</span>   :
           r.diet === "Vegan" ? <span className="chip">Vegan</span> :
           <span className="chip chip-brick">Non-Veg</span>}
        </div>
        <div className="like"><IcHeart size={15}/></div>
      </div>
      <div className="body">
        <div className="title">{r.name}</div>
        <div className="serif-it" style={{ fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.4, minHeight: 38 }}>{r.tagline}</div>
        <div className="row between mt-2">
          <div className="row gap-3" style={{ color: "var(--ink-3)", fontSize: 12.5 }}>
            <span className="row gap-1"><IcClock size={13}/> {r.time}m</span>
            <span className="row gap-1"><IcFlame size={13}/> {r.macros.kcal} kcal</span>
          </div>
          <div className="rating"><StarRow value={r.rating} size={11}/> <span style={{ color: "var(--ink-3)" }}>{r.rating}</span></div>
        </div>
        {showNutrition && (
          <div className="mt-3" style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 10 }}>
            <MacroRow macros={r.macros} compact/>
          </div>
        )}
      </div>
    </div>
  );
}
// ─────────────────────── RecipeCard ─────────────── END ────────────────────

// ─────────────────────── FilterGroup ─────────────── START ──────────────────
// calls:     none (presentational)
// called by: HomeScreen
function FilterGroup({ label, children }) {
  return (
    <div className="col gap-2">
      <div className="caps">{label}</div>
      <div className="row gap-2" style={{ flexWrap: "wrap" }}>{children}</div>
    </div>
  );
}
// ─────────────────────── FilterGroup ─────────────── END ────────────────────

// ─────────────────────── HomeScreen ─────────────── START ──────────────────
// calls:     L2/useHome: useHome
// called by: L1/App
export default function HomeScreen({ recipes, cuisines, courses, diets, showNutrition, openRecipe }) {
  const {
    q, setQ, cuisine, setCuisine, course, setCourse,
    diet, setDiet, layout, setLayout, sortBy, setSortBy, filtered,
  } = useHome({ recipes });

  const hero = recipes.find(r => r.id === "biryani") ?? recipes[0];

  const getCuisineLabel = (id) => cuisines.find(c => c.id === id)?.label ?? id;

  return (
    <div className="main">
      <PageHeader
        eyebrow="Volume IV · Spring Issue"
        title={<>The day's <span style={{ fontStyle: "italic", color: "var(--brick)" }}>cookbook</span></>}
        sub="Twelve dishes from the house pantry, ranked by what's good and what's already on your shelf."
        actions={<>
          <button className="btn-ghost btn"><IcWand size={14}/> Surprise me</button>
          <button className="btn btn-brick" onClick={() => openRecipe(hero)}><IcFlame size={14}/> Cook today's pick</button>
        </>}
      />

      {/* Hero */}
      <div className="card mb-6" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", overflow: "hidden", minHeight: 340 }}>
        <div style={{ padding: 36, display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid var(--line-soft)" }}>
          <div>
            <Stamp tone="brick">Editor's pick · No. 47</Stamp>
            <h2 className="mt-3" style={{ fontSize: 48, lineHeight: 1.05 }}>{hero.name}</h2>
            <div className="serif-it mt-3" style={{ fontSize: 17, color: "var(--ink-2)", maxWidth: 480 }}>{hero.tagline}</div>
            <p className="mt-4" style={{ fontFamily: "var(--f-serif)", fontSize: 15, color: "var(--ink-3)", lineHeight: 1.6, maxWidth: 480 }}>
              <span className="fdisp" style={{ fontSize: 32, float: "left", lineHeight: 0.9, paddingRight: 6, color: "var(--brick)" }}>T</span>
              raced to the royal kitchens of seventeenth-century Hyderabad, biryani is the kind of dish you don't make so much as choreograph. Your pantry has 14 of 16 ingredients on hand.
            </p>
          </div>
          <div className="row between mt-5" style={{ paddingTop: 18, borderTop: "1px solid var(--line-soft)" }}>
            <div className="row gap-4">
              <span className="row gap-2" style={{ color: "var(--ink-3)" }}><IcClock size={15}/> {hero.time} min</span>
              <span className="row gap-2" style={{ color: "var(--ink-3)" }}><IcUsers size={15}/> serves {hero.servings}</span>
              <span className="row gap-2" style={{ color: "var(--ink-3)" }}><StarRow value={hero.rating} size={13}/> {hero.rating}</span>
            </div>
            <button className="btn" onClick={() => openRecipe(hero)}>Open recipe <IcArrow size={14}/></button>
          </div>
        </div>
        <div style={{ position: "relative", background: "var(--paper-3)" }}>
          <ImageSlot placeholder="hero · chicken biryani · top-down" style={{ width: "100%", height: "100%", borderRadius: 0 }}/>
          <div style={{ position: "absolute", top: 16, right: 16 }}><div className="chip chip-saffron">Pantry: 14/16 ✓</div></div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="card" style={{ padding: 16, marginBottom: 24 }}>
        <div className="row gap-3" style={{ alignItems: "stretch" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <IcSearch size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)" }}/>
            <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Find a recipe, ingredient or cuisine…"
              style={{ width: "100%", height: 40, paddingLeft: 36, background: "var(--paper)", border: "1px solid var(--line-soft)", fontFamily: "var(--f-body)", fontSize: 15 }}/>
          </div>
          <div className="row gap-1" style={{ background: "var(--paper)", border: "1px solid var(--line-soft)", borderRadius: 6, padding: 3 }}>
            <button onClick={() => setLayout("grid")} className="row" style={{ padding: "6px 8px", borderRadius: 4, background: layout === "grid" ? "var(--ink)" : "transparent", color: layout === "grid" ? "var(--paper)" : "var(--ink-3)" }}><IcGrid size={14}/></button>
            <button onClick={() => setLayout("row")}  className="row" style={{ padding: "6px 8px", borderRadius: 4, background: layout === "row"  ? "var(--ink)" : "transparent", color: layout === "row"  ? "var(--paper)" : "var(--ink-3)" }}><IcList size={14}/></button>
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ minWidth: 140 }}>
            <option value="rating">Top rated</option>
            <option value="time">Fastest</option>
            <option value="cooked">Most cooked</option>
            <option value="kcal">Lowest kcal</option>
          </select>
        </div>
        <hr className="hr" style={{ margin: "14px 0" }}/>
        <div className="row gap-4" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
          <FilterGroup label="Cuisine">
            <ChipToggle active={!cuisine} onClick={() => setCuisine("")}>All</ChipToggle>
            {cuisines.map(c => <ChipToggle key={c.id} active={cuisine === c.id} onClick={() => setCuisine(cuisine === c.id ? "" : c.id)}>{c.label}</ChipToggle>)}
          </FilterGroup>
          <FilterGroup label="Course">
            <ChipToggle active={!course} onClick={() => setCourse("")}>All</ChipToggle>
            {courses.map(c => <ChipToggle key={c} active={course === c} onClick={() => setCourse(course === c ? "" : c)}>{c}</ChipToggle>)}
          </FilterGroup>
          <FilterGroup label="Diet">
            <ChipToggle active={!diet} onClick={() => setDiet("")} tone="brick">All</ChipToggle>
            {diets.map(d => <ChipToggle key={d} active={diet === d} onClick={() => setDiet(diet === d ? "" : d)} tone="brick">{d}</ChipToggle>)}
          </FilterGroup>
        </div>
      </div>

      <div className="row between mb-3">
        <div className="caps">{filtered.length} recipes</div>
        <button className="row gap-1 fmono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: ".08em", textTransform: "uppercase" }}>
          <IcFilter size={13}/> More filters
        </button>
      </div>

      {layout === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
          {filtered.map(r => <RecipeCard key={r.id} r={r} layout="grid" showNutrition={showNutrition} cuisineLabel={getCuisineLabel(r.cuisine)} onOpen={() => openRecipe(r)}/>)}
        </div>
      ) : (
        <div className="col gap-3">
          {filtered.map(r => <RecipeCard key={r.id} r={r} layout="row" showNutrition={showNutrition} cuisineLabel={getCuisineLabel(r.cuisine)} onOpen={() => openRecipe(r)}/>)}
        </div>
      )}
    </div>
  );
}
// ─────────────────────── HomeScreen ─────────────── END ────────────────────
