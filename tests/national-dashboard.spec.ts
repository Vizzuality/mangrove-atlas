import fixture from './fixtures/national-dashboard.json';
import { test, expect } from './fixtures/test';

const WIDGET_TESTID = 'widget-mangrove_national_dashboard-content';

// Real platform URL format. National Dashboard is included as a default widget
// for certain categories on the country view; we list it explicitly in
// active-widgets so the test is robust against changes to category defaults.
const PAGE_URL =
  '/country/MEX?active-widgets=mangrove_national_dashboard,mangrove_net_change,mangrove_habitat_change,mangrove_alerts,mangrove_species_location,mangrove_species_distribution,mangrove_species_threatened,widgets_deck_tool&category=all_datasets';

// page.route intercepts the backend API call (NEXT_PUBLIC_API_URL/widgets/national_dashboard?...)
// and replies with our fixture. The Next page route is unchanged.
async function mockNationalDashboardAPI(page: import('@playwright/test').Page) {
  await page.route('**/widgets/national_dashboard*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(fixture),
    });
  });
}

test.describe('National Dashboard multi-source', () => {
  test.beforeEach(async ({ page }) => {
    await mockNationalDashboardAPI(page);
    await page.goto(PAGE_URL);
    await page.getByTestId(WIDGET_TESTID).waitFor();
  });

  test('renders both sources with distinct rows', async ({ page }) => {
    const widget = page.getByTestId(WIDGET_TESTID);
    await expect(widget.getByText('CONABIO', { exact: true })).toBeVisible();
    await expect(widget.getByText('TEST', { exact: true })).toBeVisible();
    await expect(widget.getByText(/7,647\.74/)).toBeVisible();
    await expect(widget.getByText(/999/)).toBeVisible();
  });

  test('each switch has a unique aria-label', async ({ page }) => {
    const conabioSwitch = page.getByRole('switch', {
      name: /Toggle CONABIO Habitat extent area layer/,
    });
    const testSwitch = page.getByRole('switch', {
      name: /Toggle TEST Habitat extent area layer/,
    });
    await expect(conabioSwitch).toBeVisible();
    await expect(testSwitch).toBeVisible();
  });

  test('both layers can be active at once on the map', async ({ page }) => {
    const conabioSwitch = page.getByRole('switch', {
      name: /Toggle CONABIO Habitat extent area layer/,
    });
    const testSwitch = page.getByRole('switch', {
      name: /Toggle TEST Habitat extent area layer/,
    });

    await conabioSwitch.click();
    await expect(conabioSwitch).toHaveAttribute('data-state', 'checked');

    await testSwitch.click();
    await expect(testSwitch).toHaveAttribute('data-state', 'checked');
    await expect(conabioSwitch).toHaveAttribute('data-state', 'checked');

    // Map legend on the bottom-right lists both sources under one entry.
    const legend = page.getByTestId('legend-content');
    await expect(legend.getByText('CONABIO', { exact: true })).toBeVisible();
    await expect(legend.getByText('TEST', { exact: true })).toBeVisible();

    await conabioSwitch.click();
    await expect(conabioSwitch).toHaveAttribute('data-state', 'unchecked');
    await expect(testSwitch).toHaveAttribute('data-state', 'checked');
  });

  test('year picker is per-source', async ({ page }) => {
    const widget = page.getByTestId(WIDGET_TESTID);

    const yearTrigger = widget.getByRole('button', { name: /Select year, current 2020/ }).first();
    await yearTrigger.click();
    await page.getByRole('option', { name: '2015' }).click();

    await expect(widget.getByText(/7,755\.55/)).toBeVisible();
    await expect(widget.getByText(/999/)).toBeVisible();
  });
});
