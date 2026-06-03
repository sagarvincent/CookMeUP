import { useInventory } from '../../layers/L2_business/useInventory.js';
import { useShoppingList } from '../../layers/L2_business/useShoppingList.js';
import { IcSearch, IcEdit, IcTrash, IcPlus, IcMinus, IcX, IcLightbulb } from '../shared/Icons.jsx';
import { PageHeader, ChipToggle, ImageSlot } from '../shared/Shell.jsx';

// ─────────────────────── FreshChip ─────────────── START ──────────────────
// calls:     none (presentational)
// called by: InventoryScreen
function FreshChip({ d }) {
  if (d < 0)   return <span className="chip chip-brick">expired</span>;
  if (d <= 3)  return <span className="chip chip-saffron">{d}d left</span>;
  if (d <= 14) return <span className="chip chip-walnut">{d}d left</span>;
  return <span className="chip">{d}d left</span>;
}
// ─────────────────────── FreshChip ─────────────── END ────────────────────

// ─────────────────────── StatCard ─────────────── START ──────────────────
// calls:     none (presentational)
// called by: InventoryScreen
function StatCard({ label, v, sub, tone = "olive" }) {
  const colors = { olive: "var(--forest)", brick: "var(--brick)", saffron: "var(--saffron-acc)", walnut: "var(--walnut)" };
  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="caps">{label}</div>
      <div className="fdisp mt-2" style={{ fontSize: 44, lineHeight: 1, color: colors[tone] }}>{v}</div>
      <div className="serif-it mt-1" style={{ fontSize: 13, color: "var(--ink-3)" }}>{sub}</div>
    </div>
  );
}
// ─────────────────────── StatCard ─────────────── END ────────────────────

// ─────────────────────── Field ─────────────── START ──────────────────
// calls:     none (presentational)
// called by: InventoryScreen (modal)
function Field({ label, children, grow }) {
  return (
    <label className="col" style={{ gap: 4, flex: grow ? 1 : "initial" }}>
      <span className="caps">{label}</span>
      {children}
    </label>
  );
}
// ─────────────────────── Field ─────────────── END ────────────────────

// ─────────────────────── InventoryScreen ─────────────── START ──────────────────
// calls:     L2/useInventory: useInventory
// called by: L1/App
export function InventoryScreen({ inventory: initialInventory }) {
  const {
    inv, q, setQ, cat, setCat, editing, setEditing,
    cats, filtered, stats, adjust, saveItem, daysUntil, stockPercent,
  } = useInventory({ initialInventory });

  return (
    <div className="main">
      <PageHeader
        eyebrow="Larder ledger"
        title={<>The <span style={{ fontStyle: "italic", color: "var(--forest)" }}>pantry</span></>}
        sub="Edit quantities by hand, or let cooking sessions auto-decrement as you go."
        actions={<>
          <button className="btn btn-ghost"><IcEdit size={14}/> Bulk import</button>
          <button className="btn" onClick={() => setEditing({ name: "", qty: 1, unit: "", category: "Produce", expires: "2026-06-01" })}>
            <IcPlus size={14}/> Add ingredient
          </button>
        </>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 24 }}>
        <StatCard label="Stocked items"      v={stats.stocked}       sub={`of ${inv.length} tracked`} tone="olive"/>
        <StatCard label="Out of stock"        v={stats.out}           sub="re-order soon"               tone="brick"/>
        <StatCard label="Expiring this week"  v={stats.expiring}      sub="use first"                   tone="saffron"/>
        <StatCard label="Categories"          v={stats.categoryCount} sub="organized"                   tone="walnut"/>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 18, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <IcSearch size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)" }}/>
          <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Find an ingredient…" style={{ width: "100%", height: 36, paddingLeft: 34 }}/>
        </div>
        <div className="row gap-2" style={{ flexWrap: "wrap" }}>
          <ChipToggle active={!cat} onClick={() => setCat("")}>All</ChipToggle>
          {cats.map(c => <ChipToggle key={c} active={cat === c} onClick={() => setCat(cat === c ? "" : c)}>{c}</ChipToggle>)}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ paddingLeft: 20, width: 50 }}></th>
              <th>Ingredient</th><th>Category</th><th>On hand</th>
              <th style={{ width: 140 }}>Stock</th><th>Freshness</th><th style={{ width: 80 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(i => {
              const d        = daysUntil(i.expires);
              const stockPct = stockPercent(i.qty);
              return (
                <tr key={i.name}>
                  <td style={{ paddingLeft: 20 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--paper-2)", display: "grid", placeItems: "center", color: "var(--ink-3)", fontFamily: "var(--f-display)", fontSize: 14 }}>{i.name[0]}</div>
                  </td>
                  <td style={{ fontFamily: "var(--f-serif)", fontSize: 16 }}>{i.name}</td>
                  <td className="fmono" style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".08em" }}>{i.category}</td>
                  <td>
                    <div className="row gap-2">
                      <button onClick={() => adjust(i.name, -0.5)} style={{ width: 24, height: 24, borderRadius: 4, border: "1px solid var(--line)", background: "var(--paper)" }}><IcMinus size={11}/></button>
                      <span className="fmono" style={{ minWidth: 60, textAlign: "center" }}>{i.qty} {i.unit}</span>
                      <button onClick={() => adjust(i.name, 0.5)} style={{ width: 24, height: 24, borderRadius: 4, border: "1px solid var(--line)", background: "var(--paper)" }}><IcPlus size={11}/></button>
                    </div>
                  </td>
                  <td>
                    <div className={"bar " + (i.qty === 0 ? "danger" : i.qty < 1 ? "warn" : "")}>
                      <div style={{ width: stockPct + "%" }}/>
                    </div>
                  </td>
                  <td><FreshChip d={d}/></td>
                  <td>
                    <div className="row gap-1">
                      <button style={{ color: "var(--ink-3)" }} onClick={() => setEditing({ ...i, _originalName: i.name })}><IcEdit size={14}/></button>
                      <button style={{ color: "var(--ink-3)" }} onClick={() => {}}><IcTrash size={14}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <div onClick={() => setEditing(null)} style={{ position: "fixed", inset: 0, background: "rgba(42,36,26,.45)", display: "grid", placeItems: "center", zIndex: 100 }}>
          <div className="card" onClick={e => e.stopPropagation()} style={{ padding: 28, width: 460, background: "var(--cream-card)" }}>
            <div className="eyebrow">{editing._originalName ? "Edit entry" : "New entry"}</div>
            <h3 className="mt-1 mb-4">{editing._originalName ? "Edit pantry item" : "Add to pantry"}</h3>
            <div className="col gap-3">
              <Field label="Name"><input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="e.g. saffron"/></Field>
              <div className="row gap-3">
                <Field label="Quantity" grow><input type="number" value={editing.qty} onChange={e => setEditing({ ...editing, qty: +e.target.value })}/></Field>
                <Field label="Unit" grow><input value={editing.unit} onChange={e => setEditing({ ...editing, unit: e.target.value })} placeholder="cup, g, tsp…"/></Field>
              </div>
              <div className="row gap-3">
                <Field label="Category" grow>
                  <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                    {["Produce","Protein","Dairy","Grain","Spice","Herb","Fat","Aromatic"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Best before" grow><input type="date" value={editing.expires} onChange={e => setEditing({ ...editing, expires: e.target.value })}/></Field>
              </div>
            </div>
            <div className="row gap-2 mt-5" style={{ justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn" onClick={saveItem}>Save to pantry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ─────────────────────── InventoryScreen ─────────────── END ────────────────────

// ─────────────────────── ShoppingScreen ─────────────── START ──────────────────
// calls:     L2/useShoppingList: useShoppingList
// called by: L1/App
export function ShoppingScreen({ plan, inventory }) {
  const { planned, aggregated, checked, toggle, totalShort, totalDone } = useShoppingList({ plan, inventory });

  return (
    <div className="main">
      <PageHeader
        eyebrow="The market run"
        title={<>Shopping <span style={{ fontStyle: "italic", color: "var(--brick)" }}>list</span></>}
        sub={`${totalShort} ingredients across your planned meals. Tap to tick off as you collect.`}
        actions={<>
          <button className="btn btn-ghost"><IcEdit size={14}/> Edit plan</button>
          <button className="btn">Send to phone</button>
        </>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 28 }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="row between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--line-soft)" }}>
            <div className="caps">To buy · {totalDone}/{totalShort}</div>
            <div className="bar" style={{ width: 160 }}><div style={{ width: (totalShort > 0 ? (totalDone / totalShort * 100) : 0) + "%" }}/></div>
          </div>
          <div className="col">
            {aggregated.map((it, i) => (
              <label key={it.name} className="row gap-3" style={{ padding: "14px 20px", borderBottom: i < aggregated.length - 1 ? "1px solid var(--line-soft)" : "none", cursor: "pointer", alignItems: "center" }}>
                <input type="checkbox" checked={!!checked[it.name]} onChange={() => toggle(it.name)} style={{ width: 18, height: 18, accentColor: "var(--forest)" }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--f-serif)", fontSize: 17, textDecoration: checked[it.name] ? "line-through" : "none", color: checked[it.name] ? "var(--ink-3)" : "var(--ink)" }}>{it.name}</div>
                  <div className="serif-it" style={{ fontSize: 13, color: "var(--ink-3)" }}>for {it.used_in.join(" · ")}</div>
                </div>
                <div className="fmono" style={{ color: "var(--ink-3)", minWidth: 70, textAlign: "right" }}>{Math.round(it.short * 100) / 100} {it.unit}</div>
              </label>
            ))}
          </div>
        </div>

        <div className="col gap-4">
          <div className="card" style={{ padding: 20 }}>
            <div className="eyebrow">For these meals</div>
            <div className="col gap-2 mt-3">
              {planned.map(p => (
                <div key={p.id} className="row gap-3" style={{ paddingBottom: 10, borderBottom: "1px dashed var(--line-soft)" }}>
                  <ImageSlot placeholder={p.name} style={{ width: 44, height: 44, borderRadius: 6, flexShrink: 0 }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--f-serif)", fontSize: 15 }}>{p.name}</div>
                    <div className="fmono" style={{ fontSize: 11, color: "var(--ink-3)" }}>{p.time}m · {p.servings} servings</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card-soft" style={{ padding: 20, background: "rgba(201,138,42,.08)", border: "1px solid rgba(201,138,42,.3)" }}>
            <div className="row gap-2" style={{ color: "var(--saffron-acc)" }}>
              <IcLightbulb size={16}/>
              <div className="caps" style={{ color: "var(--saffron-acc)" }}>Substitution tip</div>
            </div>
            <p className="serif-it mt-2" style={{ color: "var(--ink-2)", lineHeight: 1.5 }}>
              You're 1 pinch short on saffron. A teaspoon of turmeric steeped in warm milk gives you the colour. The flavour is honest, not the same.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
// ─────────────────────── ShoppingScreen ─────────────── END ────────────────────
