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

test.describe('Planet date select popup', () => {
  test('caps popup height and scrolls to reach all dates', async ({ page, browserName }) => {
    test.fixme(browserName === 'firefox', 'Firefox: flaky popup rendering');

    await page.route('**/planet-api/series/**/mosaics**', (route) =>
      route.fulfill({ status: 200, json: MOCK_MOSAICS })
    );

    await page.goto('/');
    await page.getByTestId('widgets-wrapper').waitFor();
    await page.waitForLoadState('networkidle');

    const settingsButton = page.getByTestId('basemap-settings-button');
    await settingsButton.waitFor({ timeout: 90000 });
    await settingsButton.click();
    await page.getByTestId(PLANET_LAYER).click();

    const trigger = page.getByLabel('Select period');
    await expect(trigger).toBeVisible();
    await trigger.click();

    const popup = page.getByRole('listbox');
    await expect(popup).toBeVisible();

    const box = await popup.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeLessThan(300);

    const items = page.getByRole('option');
    await expect(items).toHaveCount(MOCK_MOSAICS.mosaics.length);

    const lastItem = items.last();
    await expect(lastItem).not.toBeInViewport();

    const scrollViewport = popup.locator('[data-slot="select-viewport"]').first();
    await scrollViewport.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    await expect(lastItem).toBeInViewport();
  });
});
