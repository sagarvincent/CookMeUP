// Re-exports loadAllData from the build-time–resolved @data-loader alias.
// vite.config.js maps @data-loader to:
//   dev_local  → services/loaders/mockLoader.js  (mock files, excluded from prod bundle)
//   otherwise  → services/loaders/apiLoader.js   (real API calls)
export { loadAllData } from '@data-loader';
