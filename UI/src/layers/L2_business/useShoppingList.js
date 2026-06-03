import { useState, useMemo } from 'react';
import { aggregateShoppingList } from '../L3_composite/inventoryOps.js';

// ─────────────────────── useShoppingList ─────────────── START ──────────────────
// calls:     L3/inventoryOps: aggregateShoppingList
// called by: components/screens/ShoppingScreen
export function useShoppingList({ plan, inventory }) {
  const [checked, setChecked] = useState({});

  const planned = useMemo(() => {
    if (!plan) return [];
    const seen = new Set();
    return Object.values(plan).flatMap(day =>
      Object.values(day).filter(r => r && !seen.has(r.id) && seen.add(r.id))
    );
  }, [plan]);

  const aggregated = useMemo(
    () => aggregateShoppingList(planned, inventory),
    [planned, inventory]
  );

  const toggle = (name) => setChecked(c => ({ ...c, [name]: !c[name] }));

  const totalShort = aggregated.length;
  const totalDone  = Object.values(checked).filter(Boolean).length;

  return {
    planned,
    aggregated,
    checked,
    toggle,
    totalShort,
    totalDone,
  };
}
// ─────────────────────── useShoppingList ─────────────── END ────────────────────
