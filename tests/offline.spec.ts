import { expect, test } from './fixtures/test';

/**
 * Offline-maps service worker. Runs against the Playwright production server
 * (NODE_ENV=production), so the SW registers — unlike `next dev`.
 */
test.describe('Offline maps service worker', () => {
  test('registers and controls the page', async ({ page, browserName }) => {
    test.fixme(browserName === 'firefox', 'Firefox: SW/hydration instability');

    await page.goto('/');

    // SW becomes active and claims the client (clients.claim in activate).
    await page.waitForFunction(() => navigator.serviceWorker?.controller != null, null, {
      timeout: 60000,
    });

    const scriptURL = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      return reg?.active?.scriptURL ?? null;
    });
    expect(scriptURL).toContain('/sw.js');
  });

  test('serves cached GCS tiles offline; Mapbox is never cached', async ({
    page,
    context,
    browserName,
  }) => {
    test.fixme(browserName === 'firefox', 'Firefox: SW/hydration instability');

    await page.goto('/');
    await page.waitForFunction(() => navigator.serviceWorker?.controller != null, null, {
      timeout: 60000,
    });

    // Warm the cache: let map tiles load.
    await page.waitForTimeout(8000);

    // Mapbox tiles must NOT be cached (TOS); our caches are origin-scoped.
    const cacheState = await page.evaluate(async () => {
      const names = await caches.keys();
      const mangroveCaches = names.filter((n) => n.startsWith('mangrove-'));
      let mapboxEntries = 0;
      for (const name of names) {
        const cache = await caches.open(name);
        const reqs = await cache.keys();
        mapboxEntries += reqs.filter((r) => /mapbox\.com/.test(r.url)).length;
      }
      return { mangroveCaches, mapboxEntries };
    });

    expect(cacheState.mangroveCaches.length).toBeGreaterThan(0);
    expect(cacheState.mapboxEntries).toBe(0);

    // Going offline keeps the app usable from cache (no crash on reload).
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('body')).toBeVisible();
    await context.setOffline(false);
  });
});
