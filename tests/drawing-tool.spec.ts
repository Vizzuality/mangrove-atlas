import { test, expect } from '@playwright/test';

import { useDrawingTool } from './fixtures/drawing-tool';
import { useSidebar } from './fixtures/sidebar';
import { dismissWelcomeDialog } from './fixtures/welcome-dialog';

test('can open drawing tool', async ({ page, browserName }) => {
  test.fixme(browserName === 'firefox', 'Firefox: Recoil/hydration instability');
  await page.goto('/');
  await dismissWelcomeDialog(page);
  const drawingTool = useDrawingTool(page);
  await drawingTool.open();
  // Drawing tool is activated — button text changes to "Delete area"
  await expect(page.getByTestId('drawing-tool-button')).toContainText('Delete area');
});

test.describe('Drawing Tool is open', () => {
  test.beforeEach(async ({ page, browserName }) => {
    test.fixme(browserName === 'firefox', 'Firefox: Recoil/hydration instability');
    await page.goto('/');
    await dismissWelcomeDialog(page);
    await useDrawingTool(page).open();
  });

  test('can leave drawing tool when is empty - clicking in worldwide icon', async ({ page }) => {
    await useSidebar(page).clickWordwide();
    await expect(page.getByTestId('drawing-tool-button')).toContainText('Draw area');
  });

  test('can leave drawing tool when is empty - clicking in search icon and selecting a place', async ({
    page,
  }) => {
    await useSidebar(page).clickSearch();
    const dialog = page.getByTestId('location-dialog-content');
    await dialog.waitFor();
    // Wait for locations to load (buttons with <p> child = location items)
    const locationBtn = dialog.locator('button:has(p)').first();
    await locationBtn.waitFor({ timeout: 30000 });
    await locationBtn.click();
    await expect(page.getByTestId('drawing-tool-button')).toContainText('Draw area');
  });

  // Map canvas does not render in headless Chromium (no Mapbox token / WebGL).
  // Custom area creation is still tested via geojson upload.
  test.fixme('can draw a polygon', async ({ page }) => {
    const drawingTool = useDrawingTool(page);
    await drawingTool.draw();
    await expect(page).toHaveURL(/.*\/custom-area.*/);
    await expect(page.getByTestId('expand-collapse-button')).toBeVisible();
  });
});

test.describe('Upload shapefile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissWelcomeDialog(page);
  });

  test('can upload a geojson file', async ({ page, browserName }) => {
    test.fixme(browserName === 'firefox', 'Firefox: Recoil/hydration instability');
    const drawingTool = useDrawingTool(page);
    await drawingTool.uploadGeojson('tests/documents/geojson.json');
    await expect(page).toHaveURL(/.*\/custom-area.*/);
    await expect(page.getByTestId('expand-collapse-button')).toBeVisible();
  });

  test('will not upload a geojson file with wrong format', async ({ page, browserName }) => {
    test.fixme(browserName === 'firefox', 'Firefox: Recoil/hydration instability');
    const drawingTool = useDrawingTool(page);
    await drawingTool.uploadGeojson('tests/documents/geojson-incorrect.json');
    // URL should stay at the root — no navigation to custom-area
    await expect(page).not.toHaveURL(/.*\/custom-area.*/);
  });
});

test.describe('Custom area has a polygon', () => {
  test.beforeEach(async ({ page, browserName }) => {
    test.fixme(browserName === 'firefox', 'Firefox: Recoil/hydration instability');
    await page.goto('/');
    await dismissWelcomeDialog(page);
    // Upload geojson directly (not via drawing tool which would disable upload)
    const drawingTool = useDrawingTool(page);
    await drawingTool.uploadGeojson('tests/documents/geojson.json');
    await expect(page).toHaveURL(/.*\/custom-area.*/);
  });

  test('clicking worldwide resets custom area', async ({ page }) => {
    // Worldwide button resets directly without confirmation alert
    await useSidebar(page).clickWordwide();
    await expect(page).not.toHaveURL(new RegExp(/\/custom-area.*/));
    await expect(page.getByTestId('drawing-tool-button')).toContainText('Draw area');
  });

  test('alert when leaving custom area clicking search - cancel', async ({ page }) => {
    await useSidebar(page).clickSearch();
    await expect(page.getByText('Reset the page and delete area').first()).toBeVisible();
    await page
      .getByText('Cancel', {
        exact: true,
      })
      .last()
      .click();
    await expect(page).toHaveURL(new RegExp(/\/custom-area.*/));
  });

  test('alert when leaving custom area clicking search - accept', async ({ page }) => {
    await useSidebar(page).clickSearch();
    await expect(page.getByText('Reset the page and delete area').first()).toBeVisible();
    await page
      .getByText('Reset page', {
        exact: true,
      })
      .last()
      .click();
    await expect(page).not.toHaveURL(new RegExp(/\/custom-area.*/));
  });

  test('alert when leaving custom area clicking search - accept and close location', async ({
    page,
  }) => {
    await useSidebar(page).clickSearch();
    await expect(page.getByText('Reset the page and delete area').first()).toBeVisible();
    await page
      .getByText('Reset page', {
        exact: true,
      })
      .last()
      .click();
    const locationDialog = page.getByTestId('location-dialog-content');
    await expect(locationDialog).toBeVisible();
    await locationDialog.getByRole('button', { name: 'close dialog' }).click();
    await expect(page).not.toHaveURL(new RegExp(/\/custom-area.*/));
    await expect(page.locator('h1')).toHaveText('the world');
  });

  test('can remove a polygon', async ({ page }) => {
    await page.getByTestId('delete-custom-area-button').first().click();
    await expect(page.getByTestId('delete-custom-area-button').first()).not.toBeVisible();
    await expect(page.getByTestId('drawing-tool-button')).toContainText('Draw area');
  });
});
