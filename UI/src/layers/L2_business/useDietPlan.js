import { useState, useMemo } from 'react';
import { dayTotals, weekKcalArray, avgWeekKcal } from '../L3_composite/dietPlanOps.js';

// ─────────────────────── useDietPlan ─────────────── START ──────────────────
// calls:     L3/dietPlanOps: dayTotals, weekKcalArray, avgWeekKcal
// called by: components/screens/DietPlanScreen
export function useDietPlan({ plan, setPlan, initialTargets }) {
  const [activeDay, setActiveDay] = useState('Fri');
  const [picker,    setPicker]    = useState(null);
  const [targets,   setTargets]   = useState(initialTargets);

  const todayTotals = useMemo(() => dayTotals(plan, activeDay), [plan, activeDay]);
  const weekKcal    = useMemo(() => weekKcalArray(plan), [plan]);
  const avgKcal     = useMemo(() => avgWeekKcal(plan), [plan]);

  const changeRecipe = (day, meal, recipe) => {
    setPlan({ ...plan, [day]: { ...plan[day], [meal]: recipe } });
    setPicker(null);
  };

  return {
    activeDay, setActiveDay,
    picker, setPicker,
    targets, setTargets,
    todayTotals,
    weekKcal,
    avgKcal,
    changeRecipe,
  };
}
// ─────────────────────── useDietPlan ─────────────── END ────────────────────
