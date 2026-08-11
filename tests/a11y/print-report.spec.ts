import { expect, test } from '../fixtures/test';

import { expectNoViolations } from './utils/axe';

test.describe('a11y: print report', () => {
  test('has no WCAG violations', async ({ page }) => {
    await page.goto('/print-report/country/IDN');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await expectNoViolations(page, { route: '/print-report' });
  });

  test('exposes a main landmark for the skip link', async ({ page }) => {
    await page.goto('/print-report/country/IDN');
    await expect(page.locator('main#main-content')).toHaveCount(1);
  });
});
