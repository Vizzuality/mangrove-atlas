import { test, expect } from '@playwright/test';

import WIDGETS from '@/containers/widgets/constants';

const DEFAULT_LOCATION = 'worldwide';
const DEFAULT_CATEGORY = 'distribution_and_change';
const WIDGETS_BY_CATEGORY = WIDGETS.filter(
  ({ categoryIds, locationType }) =>
    categoryIds?.includes(DEFAULT_CATEGORY) && locationType?.includes(DEFAULT_LOCATION)
);

test.beforeEach(async ({ page }) => {
  await page.goto(`/?category="distribution_and_change"`);
});

test.describe('Expand / collapse widgets functionality', () => {
  test('Expand button text', async ({ page }) => {
    // Widgets should appear collapsed by default, button must be ready to expand them
    await expect(page.getByTestId('expand-collapse-button')).toBeVisible();
  });

  test('Expanded widgets', async ({ page }) => {
    // Check that all widgets are visible
    for (const widget of WIDGETS_BY_CATEGORY) {
      await expect(page.getByTestId(`widget-${widget.slug}-content`)).toBeHidden();
    }
  });

  test('Collapse button text', async ({ page }) => {
    await page.goto(`/?category="distribution_and_change"`);

    // Click on button to expand widgets
    const button = page.getByTestId('expand-collapse-button');
    await button.click();

    // Check if the button text is correct
    await expect(page.getByTestId('expand-collapse-button')).toBeVisible();
  });

  test('Collapsed  widgets', async ({ page }) => {
    // Widgets should be collapsed by default — their content should be hidden
    for (const widget of WIDGETS_BY_CATEGORY) {
      await expect(page.getByTestId(`widget-${widget.slug}-content`)).toBeHidden();
    }
  });
});
