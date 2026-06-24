import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// Dataset hooks import the Zod-validated `env` from env.mjs, which runs
// createEnv at module load and requires EVERY var in the schema. CI only has
// the committed .env.test (which is partial), so provide complete dummy
// defaults here to keep validation green. Real .env values overlay these.
const ENV_DEFAULTS: Record<string, string> = {
  NEXT_PUBLIC_API_URL: 'https://example.com',
  NEXT_PUBLIC_MRTT_SITE: 'https://example.com',
  NEXT_PUBLIC_AUTH_URL: 'https://example.com',
  NEXT_PUBLIC_ANALYSIS_API_URL: 'https://example.com',
  NEXT_PUBLIC_ANALYSIS_API_PATH: 'analysis-staging',
  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: 'test',
  NEXT_PUBLIC_PLANET_API_KEY: 'test',
  NEXT_PUBLIC_TRANSIFEX_API_KEY: 'test',
  NEXT_PUBLIC_SMTP_ADDRESS: 'test',
  NEXT_PUBLIC_SMTP_PASSWORD: 'test',
  NEXT_PUBLIC_SMTP_PORT: '587',
  NEXT_PUBLIC_SMTP_USER_NAME: 'test',
  NEXT_PUBLIC_GA_ID: 'test',
  NEXT_PUBLIC_VERCEL_ENV: 'development',
  NEXT_PUBLIC_ENVIRONMENT: 'development',
  NEXTAUTH_URL: 'https://example.com',
  NEXTAUTH_SECRET: 'test',
  AUTH_API_URL: 'https://example.com',
};

// Overlay real .env files (ascending priority — later overrides earlier) onto
// the defaults so local runs use real values while CI falls back to defaults.
// Hand-parsed to avoid depending on vite's loadEnv (transitive, no types).
function loadTestEnv(): Record<string, string> {
  const env: Record<string, string> = { ...ENV_DEFAULTS };
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
