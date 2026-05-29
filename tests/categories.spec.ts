import WIDGETS from '@/containers/widgets/constants';

import type { Category } from 'types/category';

import { test, expect } from './fixtures/test';

const DIALOG_CATEGORIES = [
  'distribution_and_change',
  'restoration_and_conservation',
  'climate_and_policy',
  'ecosystem_services',
  'contextual_layers',
  'custom',
] as const;

const CATEGORY_OPTIONS = [
  'distribution_and_change',
  'restoration_and_conservation',
  'climate_and_policy',
  'ecosystem_services',
  'contextual_layers',
] as Category[];
const DEFAULT_LOCATION = 'worldwide';

test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
});

test('Selecting a category changes the url query "category"', async ({ page }) => {
  const widgetsDeckTrigger = page.getByTestId('widgets-deck-trigger');
  await expect(widgetsDeckTrigger).toBeVisible();
  await widgetsDeckTrigger.click();
  await page.getByText('Widgets deck settings').waitFor();

  // Skip the default category — clicking it won't change the URL.
  for (const category of DIALOG_CATEGORIES.slice(1)) {
    const categoryButton = page.getByTestId(category);
    await expect(categoryButton).toBeVisible();
    await categoryButton.click();

    await expect(page).toHaveURL(new RegExp(`category=.*${category}`));
  }
});

test.describe('Categories display the correct widgets', () => {
  for (const category of CATEGORY_OPTIONS) {
    test(`Category ${category} displays correct widgets`, async ({ page }) => {
      const widgetsForCategory = WIDGETS.filter(
        ({ categoryIds, locationType }) =>
          categoryIds?.includes(category) && locationType?.includes(DEFAULT_LOCATION)
      );

      const activeWidgets = widgetsForCategory.map((w) => w.slug).join(',');
      await page.goto(`/?category=${category}&active-widgets=${activeWidgets}`);
      await page.getByTestId('widgets-wrapper').waitFor({ state: 'attached' });

      for (const widget of widgetsForCategory) {
        await expect(page.getByTestId(`widget-${widget.slug}`)).toBeVisible();
      }
    });
  }
});
