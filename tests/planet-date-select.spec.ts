import { test, expect } from './fixtures/test';

const PLANET_LAYER = 'planet_medres_visual_monthly';

const MOCK_MOSAICS = {
  mosaics: Array.from({ length: 30 }, (_, i) => {
    const totalMonths = i;
    const month = 12 - (totalMonths % 12);
    const year = 2026 - Math.floor(totalMonths / 12);
    const date = `${year}-${String(month).padStart(2, '0')}-01T00:00:00Z`;
    return { first_acquired: date, last_acquired: date };
  }),
};

const ACTIVE_LAYERS = JSON.stringify([
  { id: PLANET_LAYER, opacity: '1', visibility: 'visible' },
  { id: 'mangrove_habitat_extent', opacity: '1', visibility: 'visible' },
]);

test.describe('Planet date select popup', () => {
  test('caps popup height and scrolls to reach all dates', async ({ page, browserName }) => {
    test.fixme(browserName === 'firefox', 'Firefox: flaky popup rendering');

    await page.route('**/planet-api/series/**/mosaics**', (route) =>
      route.fulfill({ status: 200, json: MOCK_MOSAICS })
    );

    await page.goto(`/?layers=${encodeURIComponent(ACTIVE_LAYERS)}`);
    await page.getByTestId('widgets-wrapper').waitFor();

    const trigger = page.getByLabel('Select period');
    await expect(trigger).toBeVisible({ timeout: 30000 });
    await trigger.click();

    const popup = page.getByRole('listbox');
    await expect(popup).toBeVisible();

    const box = await popup.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeLessThan(300);

    const items = page.getByRole('option');
    await expect(items).toHaveCount(MOCK_MOSAICS.mosaics.length);

    // Radix auto-scrolls the popup to the selected item (oldest mosaic, last
    // in DOM order after desc sort), so the newest mosaic (first in DOM) is
    // off-screen on open and only reachable by scrolling up.
    const firstItem = items.first();
    await expect(firstItem).not.toBeInViewport();

    const scrollViewport = popup.locator('[data-slot="select-viewport"]').first();
    await scrollViewport.evaluate((el) => {
      el.scrollTop = 0;
    });

    await expect(firstItem).toBeInViewport();
  });
});
