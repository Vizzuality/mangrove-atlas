import { expect, test } from '../fixtures/test';

import { expectNoViolations } from './utils/axe';

test.describe('a11y: embedded view', () => {
  test('has no WCAG violations', async ({ page }) => {
    await page.goto('/embedded/country/IDN');
    await expect(page.getByTestId('widgets-wrapper')).toBeVisible();

    await expectNoViolations(page, { route: '/embedded' });
  });

  test('exposes a main landmark for the skip link', async ({ page }) => {
    // Unblocked by phase 5B. The root layout renders a skip link on every
    // route, so #main-content must exist here too.
    test.fixme(true, 'No <main id="main-content"> on /embedded until phase 5B');
    await page.goto('/embedded/country/IDN');
    await expect(page.locator('main#main-content')).toHaveCount(1);
  });
});
