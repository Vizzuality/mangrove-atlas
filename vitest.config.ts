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
    // Vitest owns the unit/component/integration suites under tests/. Playwright
    // e2e + a11y specs (tests/*.spec.ts, tests/a11y) use *.spec.ts and are not
    // matched here.
    include: [
      'tests/unit/**/*.{test,spec}.{ts,tsx}',
      'tests/component/**/*.{test,spec}.{ts,tsx}',
      'tests/integration/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: ['cloud-functions/**', 'node_modules/**', '.next/**'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'text-summary', 'html'],
      // Unit-test coverage targets the LOGIC layer: pure utilities, state
      // parsers/atoms, hooks, and the extracted dataset data-transforms. The
      // view layer (React components, widget cards, charts, Mapbox layer
      // configs) is covered by Playwright e2e in a real browser, not duplicated
      // here — so it is intentionally outside the coverage denominator.
      include: [
        'src/lib/**/*.{ts,tsx}',
        'src/store/**/*.{ts,tsx}',
        'src/hooks/**/*.{ts,tsx}',
        'src/utils/**/*.{ts,tsx}',
        'src/containers/widgets/utils.tsx',
        'src/containers/datasets/*/get-data.tsx',
      ],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/**/*.d.ts',
        'src/**/constants.{ts,tsx}',
        'src/**/types.{ts,tsx}',
      ],
    },
  },
});
