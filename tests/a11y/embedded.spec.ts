import { expect, test } from '../fixtures/test';

import { expectNoViolations } from './utils/axe';

test.describe('a11y: embedded view', () => {
  test('has no WCAG violations', async ({ page }) => {
    await page.goto('/embedded/country/IDN');
    // The embedded view is the map and its legend — there is no widgets column
    // here, so the legend is the last thing to settle.
    await expect(page.getByTestId('legend-content')).toBeVisible();

    await expectNoViolations(page, { route: '/embedded' });
  });

  test('exposes a main landmark for the skip link', async ({ page }) => {
    // The root layout renders a skip link on every route, so #main-content must
    // exist here too.
    await page.goto('/embedded/country/IDN');
    await expect(page.locator('main#main-content')).toHaveCount(1);
  });
});
