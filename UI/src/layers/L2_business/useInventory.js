import { useState, useMemo } from 'react';
import { computeInventoryStats } from '../L3_composite/inventoryOps.js';
import { adjustQty, daysUntil, stockPercent } from '../L4_primitives/inventoryUtils.js';

// ─────────────────────── useInventory ─────────────── START ──────────────────
// calls:     L3/inventoryOps: computeInventoryStats
//            L4/inventoryUtils: adjustQty, daysUntil, stockPercent
// called by: components/screens/InventoryScreen
export function useInventory({ initialInventory }) {
  const [inv,     setInv]     = useState(initialInventory);
  const [q,       setQ]       = useState('');
  const [cat,     setCat]     = useState('');
  const [editing, setEditing] = useState(null);

  const cats = useMemo(() => Array.from(new Set(inv.map(i => i.category))), [inv]);

  const filtered = useMemo(
    () => inv.filter(i =>
      (!q || i.name.toLowerCase().includes(q.toLowerCase())) &&
      (!cat || i.category === cat)
    ),
    [inv, q, cat]
  );

  const stats = useMemo(() => computeInventoryStats(inv), [inv]);

  const adjust = (name, delta) => {
    setInv(inv.map(i => i.name === name ? { ...i, qty: adjustQty(i.qty, delta) } : i));
  };

  const saveItem = () => {
    if (!editing?.name) return;
    const { _originalName, ...item } = editing;
    if (_originalName) {
      setInv(inv.map(x => x.name === _originalName ? item : x));
    } else {
      setInv([...inv, item]);
    }
    setEditing(null);
  };

  return {
    inv,
    q, setQ,
    cat, setCat,
    editing, setEditing,
    cats,
    filtered,
    stats,
    adjust,
    saveItem,
    daysUntil,
    stockPercent,
  };
}
// ─────────────────────── useInventory ─────────────── END ────────────────────
