/// <reference types="./src/env"/>
import react from '@vitejs/plugin-react';
import { UserConfigExport, defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import istanbul from 'vite-plugin-istanbul';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }): UserConfigExport => {
  process.env = {
    VITE_VERSION: 'default',
    VITE_BUILD_TIMESTAMP: new Date().toISOString(),
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  };

  return defineConfig({
    base: '',
    server: {
      port: parseInt(process.env.VITE_PORT, 10) || 4001,
      open: false, // do not open the browser on start
      watch: {
        ignored: ['**/coverage/**', '**/cypress/downloads/**'],
      },
    },
    preview: {
      port: parseInt(process.env.VITE_PORT || '3333', 10),
      strictPort: true,
    },
    build: {
      outDir: 'build',
    },
    plugins: [
      tsconfigPaths(),
      mode === 'test'
        ? undefined
        : checker({
            overlay: { position: 'br', initialIsOpen: false },
            typescript: true,
            eslint: {
              lintCommand: 'eslint "src/**/*.{ts,tsx}"',
              useFlatConfig: true,
            },
          }),
      react(),
      istanbul({
        include: 'src/*',
        exclude: ['node_modules', 'test/', '.nyc_output', 'coverage'],
        extension: ['.js', '.ts', '.tsx'],
        requireEnv: false,
        forceBuildInstrument: mode === 'test',
        checkProd: true,
      }),
    ],
  });
};
