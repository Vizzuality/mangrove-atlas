import WIDGETS from '@/containers/widgets/constants';

import { test, expect } from './fixtures/test';

const DEFAULT_LOCATION = 'worldwide';
const DEFAULT_CATEGORY = 'distribution_and_change';
const ALWAYS_EXPANDED = [
  'widgets_deck_tool',
  'mangrove_drawing_tool',
  'mangrove_drawing_upload_tool',
];
const WIDGETS_BY_CATEGORY = WIDGETS.filter(
  ({ categoryIds, locationType, slug }) =>
    categoryIds?.includes(DEFAULT_CATEGORY) &&
    locationType?.includes(DEFAULT_LOCATION) &&
    !ALWAYS_EXPANDED.includes(slug)
);

test.beforeEach(async ({ page }) => {
  await page.goto(`/?category="distribution_and_change"`);
  await page.getByTestId('widgets-wrapper').waitFor();
});

test.describe('Expand / collapse widgets functionality', () => {
  test('Expand button text', async ({ page, browserName }) => {
    test.fixme(browserName === 'firefox', 'Firefox: flaky page rendering');
    // Widgets are expanded by default, button should say "Collapse all widgets"
    await expect(page.getByTestId('expand-collapse-button')).toBeVisible();
    await expect(page.getByTestId('expand-collapse-button')).toContainText('Collapse all widgets');
  });

  test('Collapse button text', async ({ page, browserName }) => {
    test.fixme(browserName === 'firefox', 'Firefox: flaky page rendering');
    // Click to collapse all widgets
    const button = page.getByTestId('expand-collapse-button');
    await button.click();

    // Button text should now offer to expand
    await expect(button).toContainText('Expand all widgets');
  });

  test('Collapsed widgets', async ({ page, browserName }) => {
    test.fixme(browserName === 'firefox', 'Firefox: flaky page rendering');
    // Click to collapse all widgets
    await page.getByTestId('expand-collapse-button').click();

    // All widget content should be hidden
    for (const widget of WIDGETS_BY_CATEGORY) {
      await expect(page.getByTestId(`widget-${widget.slug}-content`)).toBeHidden();
    }
  });

  test('Expanded widgets', async ({ page, browserName }) => {
    test.fixme(browserName === 'firefox', 'Firefox: flaky page rendering');
    // Collapse all widgets first
    await page.getByTestId('expand-collapse-button').click();
    await expect(page.getByTestId('expand-collapse-button')).toContainText('Expand all widgets');

    // Expand all widgets
    await page.getByTestId('expand-collapse-button').click();

    // All widget content should be visible
    for (const widget of WIDGETS_BY_CATEGORY) {
      await expect(page.getByTestId(`widget-${widget.slug}-content`)).toBeVisible();
    }
  });
});
