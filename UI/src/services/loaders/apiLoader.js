import { fetchAll } from '../apiClient.js';

// ─────────────────────── loadAllData (api) ─────────────── START ──────────────────
// calls:     services/apiClient: fetchAll
// called by: services/dataService: loadAllData (via @data-loader alias, dev_cluster + production)
export async function loadAllData() {
  return fetchAll();
}
// ─────────────────────── loadAllData (api) ─────────────── END ────────────────────
