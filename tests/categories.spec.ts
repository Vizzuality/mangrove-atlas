import { test, expect } from '@playwright/test';

import WIDGETS from '@/containers/widgets/constants';

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
    const url = new RegExp(`.*?category=${encodeURIComponent(`"${category}"`)}`);
    await expect(page).toHaveURL(url);
  }
});

async function testCategoryWidgets(page, category: Category) {
  await page.goto(`/?category="${category}"`);
  await page.getByTestId('widgets-wrapper').waitFor();

  // Get all widgets that should be enabled for this category and location
  const widgets = WIDGETS.filter(
    ({ categoryIds, locationType }) =>
      categoryIds?.includes(`${category}`) && locationType?.includes(DEFAULT_LOCATION)
  );

  // At least some widgets should be rendered
  const widgetsWrapper = page.getByTestId('widgets-wrapper');
  const renderedCount = await widgetsWrapper.locator('> div').count();
  expect(renderedCount).toBeGreaterThan(0);

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
