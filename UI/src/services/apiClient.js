// ─────────────────────── get ─────────────── START ──────────────────
// calls:     none (native fetch)
// called by: services/apiClient: fetchAll
export async function get(path) {
  const base = import.meta.env.VITE_API_BASE ?? '';
  const res  = await fetch(`${base}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}
// ─────────────────────── get ─────────────── END ────────────────────

// ─────────────────────── fetchAll ─────────────── START ──────────────────
// calls:     services/apiClient: get
// called by: services/dataService: loadAllData (dev_cluster + production)
export async function fetchAll() {
  return get('/data/bootstrap');
}
// ─────────────────────── fetchAll ─────────────── END ────────────────────
