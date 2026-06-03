import { useState, useMemo } from 'react';
import { filterAndSortRecipes } from '../L3_composite/recipeFiltering.js';

// ─────────────────────── useHome ─────────────── START ──────────────────
// calls:     L3/recipeFiltering: filterAndSortRecipes
// called by: components/screens/HomeScreen
export function useHome({ recipes }) {
  const [q,       setQ]       = useState('');
  const [cuisine, setCuisine] = useState('');
  const [course,  setCourse]  = useState('');
  const [diet,    setDiet]    = useState('');
  const [layout,  setLayout]  = useState('grid');
  const [sortBy,  setSortBy]  = useState('rating');

  const filtered = useMemo(
    () => filterAndSortRecipes(recipes, { q, cuisine, course, diet }, sortBy),
    [recipes, q, cuisine, course, diet, sortBy]
  );

  return {
    q, setQ,
    cuisine, setCuisine,
    course, setCourse,
    diet, setDiet,
    layout, setLayout,
    sortBy, setSortBy,
    filtered,
  };
}
// ─────────────────────── useHome ─────────────── END ────────────────────
