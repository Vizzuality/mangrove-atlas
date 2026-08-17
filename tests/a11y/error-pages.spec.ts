import { expect, test } from '../fixtures/test';

import { expectNoViolations } from './utils/axe';

test.describe('a11y: error pages', () => {
  test('404 has no WCAG violations', async ({ page }) => {
    // Any top-level path outside ALLOWED_LOCATION_TYPES resolves to not-found.
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await expectNoViolations(page, { route: '/404' });
  });

  test('404 exposes a main landmark for the skip link', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.locator('main#main-content')).toHaveCount(1);
  });
});
