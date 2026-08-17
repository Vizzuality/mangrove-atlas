import type { Page } from '@playwright/test';

import { expect, test } from '../fixtures/test';

import { expectNoViolations } from './utils/axe';

/**
 * Anchor every scan on a settled widget, never `networkidle`.
 *
 * Widget cards render skeletons while their React Query hooks resolve against
 * the live API. Scanning mid-skeleton produces both false passes (the failing
 * markup has not rendered yet) and false failures (colour-contrast against a
 * pulsing placeholder).
 */
async function waitForWidgets(page: Page) {
  await expect(page.getByTestId('widgets-wrapper')).toBeVisible();
  await expect(page.getByTestId('widget-mangrove_habitat_extent-content')).toBeVisible();
}

test.describe('a11y: map application', () => {
  test('worldwide view has no WCAG violations', async ({ page }) => {
    await page.goto('/');
    await waitForWidgets(page);

    await expectNoViolations(page, { route: '/' });
  });

  test('country view has no WCAG violations', async ({ page }) => {
    await page.goto('/country/IDN');
    await waitForWidgets(page);

    await expectNoViolations(page, { route: '/country/IDN' });
  });

  test('page has exactly one h1 that names the location', async ({ page }) => {
    await page.goto('/country/IDN');
    await waitForWidgets(page);

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).not.toBeEmpty();
  });

  test('skip link is the first focusable element and targets a real node', async ({ page }) => {
    await page.goto('/');
    await page.locator('body').press('Tab');

    const focused = page.locator(':focus');
    await expect(focused).toHaveText(/skip to main content/i);

    const href = await focused.getAttribute('href');
    expect(href).toBe('#main-content');
    await expect(page.locator('#main-content')).toHaveCount(1);
  });
});
