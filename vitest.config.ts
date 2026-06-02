import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // ignoreConfigErrors: skip the nested cloud-functions/* tsconfigs (out of scope).
  plugins: [react(), tsconfigPaths({ ignoreConfigErrors: true })],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Unit / integration tests live next to source as *.test.ts(x).
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    // Playwright e2e (tests/) and cloud functions are out of scope for Vitest.
    exclude: ['tests/**', 'cloud-functions/**', 'node_modules/**', '.next/**'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      include: ['src/**'],
    },
  },
});
