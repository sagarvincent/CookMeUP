import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env      = loadEnv(mode, process.cwd(), '');
  const appEnv   = env.VITE_APP_ENV ?? mode;
  const isLocal  = appEnv === 'dev_local';

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_APP_ENV': JSON.stringify(appEnv),
    },
    resolve: {
      alias: {
        // Build-time alias: mock data loader is only bundled in dev_local builds.
        // All other modes resolve to the API loader, keeping mock data out of the bundle.
        '@data-loader': isLocal
          ? resolve(__dirname, 'src/services/loaders/mockLoader.js')
          : resolve(__dirname, 'src/services/loaders/apiLoader.js'),
      },
    },
  };
});
