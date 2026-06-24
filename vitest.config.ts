import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// Merge the .env files into an object passed to test.env so the Zod-validated
// `env` from env.mjs (which runs createEnv at module load) resolves when hooks
// import it. Hand-parsed to avoid depending on vite's loadEnv (transitive, no
// types). Files are read in ascending priority — later overrides earlier — to
// match Vite/Next precedence (mode and *.local files win over the base .env).
function loadTestEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const name of ['.env', '.env.local', '.env.test', '.env.test.local']) {
    try {
      const file = readFileSync(resolve(process.cwd(), name), 'utf-8');
      for (const line of file.split('\n')) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)\s*$/);
        if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '');
      }
    } catch {
      // file absent — skip
    }
  }
  return env;
}

const testEnv = loadTestEnv();

export default defineConfig({
  // ignoreConfigErrors: skip the nested cloud-functions/* tsconfigs (out of scope).
  plugins: [react(), tsconfigPaths({ ignoreConfigErrors: true })],
  test: {
    environment: 'jsdom',
    globals: true,
    env: testEnv,
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
