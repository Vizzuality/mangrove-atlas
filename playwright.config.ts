import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

/**
 * Load deterministic test env BEFORE the webServer child is spawned.
 *
 * `override: true` replaces any values the developer has in their shell or
 * personal .env for the duration of this process, so `next build` bakes the
 * same NEXT_PUBLIC_* values into the client bundle on every machine. Without
 * this, a developer with NEXT_PUBLIC_VERCEL_ENV=development in their .env
 * builds a different binary than CI does, and tests silently diverge.
 *
 * Secrets (NEXTAUTH_SECRET, API URLs, Mapbox token, …) intentionally live
 * OUTSIDE this file: the developer's own .env locally, GitHub Secrets in CI.
 */
dotenv.config({ path: '.env.test', override: true });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const PORT = process.env.PORT || 3000;

const STORAGE_STATE = 'test-results/.auth/storage-state.json';

export default defineConfig({
  testDir: 'tests',
  outputDir: 'test-results',
  globalSetup: require.resolve('./tests/fixtures/global-setup'),
  timeout: 120000,
  expect: {
    timeout: 120000,
  },
  /* Build and run in production mode before starting the tests */
  webServer: {
    command: `pnpm build && pnpm start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 600000,
    env: {
      ...process.env,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'playwright-test-secret',
      NEXTAUTH_URL: `http://localhost:${PORT}`,
    },
  },
  /* Run tests in files in parallel */
  fullyParallel: !process.env.CI,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['list'], ['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `http://localhost:${PORT}`,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    navigationTimeout: 120000,
    /* Fail individual actions (click/fill/etc.) fast so hung clicks
     * produce a named actionability error (e.g. "intercepted by <x>")
     * instead of the 2-minute test-timeout that tells us nothing. */
    actionTimeout: 10000,
    storageState: STORAGE_STATE,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
