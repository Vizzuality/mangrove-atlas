import { test, expect } from '@playwright/test';

import WIDGETS from 'containers/widgets/constants';

import type { Category } from 'types/category';

type Data = {
  data: unknown[];
  metadata: { [key: string]: unknown };
};

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
  // Go to the category page
  const url = `https://mangrove-atlas-api-staging.herokuapp.com/api/v2/widgets/**?*`;
  const widgetResponse = page.waitForResponse(url);

  await page.goto(`/?category="${category}"`);
  await page.waitForTimeout(6000);

  // Get all widgets that should be enabled
  const widgets = WIDGETS.filter(
    ({ categoryIds, locationType }) =>
      categoryIds?.includes(`${category}`) && locationType?.includes(DEFAULT_LOCATION)
  );

  const widgetsToDisplay = [];
  // Verify whether a widget is visible or does not have data for a specific location
  for (const widget of widgets) {
    const isVisible = await page.getByTestId(`widget-${widget.slug}`).isVisible();

    if (isVisible) {
      widgetsToDisplay.push(widget);
    } else {
      const response = await widgetResponse;
      const widgetData = (await response.json()) as Data;
      expect(widgetData.data.length).toBe(0);
    }
  }

  const widgetsWrapper = page.getByTestId('widgets-wrapper');
  const widgetsWrapperChildren = await widgetsWrapper.locator('> div').count();
  expect(widgetsWrapperChildren).toEqual(widgetsToDisplay.length);
}

test.describe('Categories display the correct widgets', () => {
  for (const category of CATEGORY_OPTIONS) {
    test(`Category ${category} displays correct widgets`, async ({ page }) => {
      await testCategoryWidgets(page, category);
    });
  }
});
