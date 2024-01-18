import { test, expect } from '@playwright/test';

import WIDGETS from 'containers/widgets/constants';

import type { Category } from 'types/category';
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
  for (const category of CATEGORY_OPTIONS) {
    // Get and click on the different categories buttons
    const categoryButton = page.getByTestId(category);
    await expect(categoryButton).toBeVisible();
    await categoryButton.click();

    // Check that the url has the correct query
    const url = new RegExp(`.*?category=${`${category}`}`);
    await expect(page).toHaveURL(url);
  }
});

test.describe('Categories display the correct widgets', () => {
  for (const category of CATEGORY_OPTIONS) {
    test(`Category ${category} display correct widgets`, async ({ page }) => {
      // Go to the category page
      await page.goto(`/?category=${category}`, { waitUntil: 'load' });
      // Get all widgets that should be enabled
      const widgets = WIDGETS.filter(
        ({ categoryIds, locationType }) =>
          categoryIds?.includes(category) && locationType?.includes(DEFAULT_LOCATION)
      );
      // Check that all widgets are visible
      for (const widget of widgets) {
        test.setTimeout(120000);
        await expect(page.getByTestId(`widget-${widget.slug}`)).toBeVisible();
      }
    });
  }
});
