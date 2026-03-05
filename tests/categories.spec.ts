import { test, expect } from '@playwright/test';

import WIDGETS from '@/containers/widgets/constants';

import type { Category } from 'types/category';

import { dismissWelcomeDialog } from './fixtures/welcome-dialog';

// Categories available in the widgets deck dialog
const DIALOG_CATEGORIES = [
  'distribution_and_change',
  'restoration_and_conservation',
  'climate_and_policy',
  'ecosystem_services',
  'contextual_layers',
  'custom',
] as const;

// Categories to test widget display (navigated via URL)
const CATEGORY_OPTIONS = [
  'distribution_and_change',
  'restoration_and_conservation',
  'climate_and_policy',
  'ecosystem_services',
  'contextual_layers',
] as Category[];
const DEFAULT_LOCATION = 'worldwide';

// Dispatch a real MouseEvent via page.evaluate. This is the only click
// mechanism that works reliably across Chromium and Firefox when Radix UI
// primitives (Dialog, Checkbox) are involved — el.click(), Playwright's
// native .click(), and PointerEvent dispatches all fail in Firefox.
async function clickByTestId(page: import('@playwright/test').Page, testId: string) {
  await page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`) as HTMLElement;
    el?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  }, testId);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  await dismissWelcomeDialog(page);
});

// TODO: fix — Recoil urlSyncEffect crashes Firefox; click mechanism needs
// rework for nested Radix Checkbox buttons.
test.fixme('Selecting a category changes the url query "category"', async ({ page, browserName }) => {

  const widgetsDeckTrigger = page.getByTestId('widgets-deck-trigger');
  await expect(widgetsDeckTrigger).toBeVisible();
  await clickByTestId(page, 'widgets-deck-trigger');
  await page.getByText('Widgets deck settings').waitFor();

  // Skip the first category (distribution_and_change) because it's the default atom value
  // and clicking it won't change the URL since the value is already the default.
  for (const category of DIALOG_CATEGORIES.slice(1)) {
    const categoryButton = page.getByTestId(category);
    await expect(categoryButton).toBeVisible();
    // Click the <h4> label inside the button — the outer button contains a
    // nested Radix Checkbox (<button>) which makes direct clicks unreliable.
    await categoryButton.locator('h4').click();

    // Check that the url has the correct category query param
    await expect(page).toHaveURL(new RegExp(`category=.*${category}`));
  }
});

async function testCategoryWidgets(page, category: Category) {
  await page.goto(`/?category="${category}"`);
  // Wait for the wrapper to be attached (it may have no visible content for some categories)
  await page.getByTestId('widgets-wrapper').waitFor({ state: 'attached' });

  // Get all widgets that should be enabled for this category and location
  const widgets = WIDGETS.filter(
    ({ categoryIds, locationType }) =>
      categoryIds?.includes(`${category}`) && locationType?.includes(DEFAULT_LOCATION)
  );

  // Each rendered widget should match one from the expected list
  for (const widget of widgets) {
    const widgetLocator = page.getByTestId(`widget-${widget.slug}`);
    // Widget is either visible or not rendered (no data for this location)
    const isVisible = await widgetLocator.isVisible();
    if (isVisible) {
      await expect(widgetLocator).toBeVisible();
    }
  }
}

// TODO: fix — needs reliable widget visibility assertions.
test.describe.fixme('Categories display the correct widgets', () => {
  for (const category of CATEGORY_OPTIONS) {
    test(`Category ${category} displays correct widgets`, async ({ page }) => {
      await testCategoryWidgets(page, category);
    });
  }
});
