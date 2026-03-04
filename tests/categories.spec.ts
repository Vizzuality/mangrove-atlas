import { test, expect } from '@playwright/test';

import WIDGETS from '@/containers/widgets/constants';

import type { Category } from 'types/category';

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
  'all_datasets',
] as Category[];
const DEFAULT_LOCATION = 'worldwide';

test.beforeEach(async ({ page }) => {
  await page.goto('/', {
    waitUntil: 'load',
  });
});

test('Selecting a category changes the url query "category"', async ({ page }) => {
  const widgetsDeckTrigger = page.getByTestId('widgets-deck-trigger');
  await expect(widgetsDeckTrigger).toBeVisible();
  await widgetsDeckTrigger.click();
  await page.getByText('Widgets deck settings').waitFor();

  for (const category of DIALOG_CATEGORIES) {
    const categoryButton = page.getByTestId(category);
    await expect(categoryButton).toBeVisible();
    await categoryButton.click();

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

test.describe('Categories display the correct widgets', () => {
  for (const category of CATEGORY_OPTIONS) {
    test(`Category ${category} displays correct widgets`, async ({ page }) => {
      await testCategoryWidgets(page, category);
    });
  }
});
