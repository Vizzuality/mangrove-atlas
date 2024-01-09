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
  await page.goto('/');
});

test('Has all categories buttons', async ({ page }) => {
  // Hover over the categories on sidebar to open the category menu
  await page.getByTestId('show-categories-button').hover();
  for (const category of CATEGORY_OPTIONS) {
    // Check that the category button is visible
    await expect(page.locator(`[data-category="${category}"]`)).toBeVisible();
  }
});

test('Selecting a category changes the url query "category"', async ({ page }) => {
  const categoriesButton = page.getByTestId('show-categories-button');
  for (let i = 0; i < CATEGORY_OPTIONS.length; i++) {
    // Hover over the categories on sidebar to open the category menu
    await categoriesButton.hover();
    const category = CATEGORY_OPTIONS[i];
    // Click on the category button
    await page.locator(`[data-category="${category}"]`).click();
    // Check that the category button is active
    const categoryButton = categoriesButton.locator('div').nth(i);
    await expect(categoryButton).toHaveAttribute('data-isactive', 'true');
    // Check that the url has the correct query
    const url = new RegExp(`.*?category=${encodeURIComponent(`"${category}"`)}`);
    await expect(page).toHaveURL(url);
  }
});

test.describe('Categories display the correct widgets', () => {
  for (const category of CATEGORY_OPTIONS) {
    test(`Category ${category}  display correct widgets`, async ({ page }) => {
      // Go to the category page
      await page.goto(`/?category=${encodeURIComponent(`"${category}"`)}`);
      // Get all widgets that should be visible
      const widgets = WIDGETS.filter(
        ({ categoryIds, locationType }) =>
          categoryIds?.includes(category) && locationType?.includes(DEFAULT_LOCATION)
      );
      // Check that all widgets are visible
      for (const widget of widgets) {
        await expect(page.getByTestId(`widget-${widget.slug}`)).toBeVisible();
      }
    });
  }
});
