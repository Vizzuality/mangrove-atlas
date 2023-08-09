import { test, expect } from '@playwright/test';

import { useDrawingTool } from './fixtures/drawing-tool';
import { useSidebar } from './fixtures/sidebar';

test('can open drawing tool', async ({ page }) => {
  await page.goto('/');
  const drawingTool = useDrawingTool(page);
  await drawingTool.open();
  await expect(page).toHaveURL('/custom-area');
});

test.describe('Drawing Tool is open', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await useDrawingTool(page).open();
  });

  test('can leave drawing tool when is empty - clicking in worldwide icon', async ({ page }) => {
    await useSidebar(page).clickWordwide();
    await expect(page).not.toHaveURL(new RegExp(/\/custom-area\?.*/));
  });

  test('can leave drawing tool when is empty - clicking in search icon and selecting a place', async ({
    page,
  }) => {
    await useSidebar(page).clickSearch();
    await page.click('[role="dialog"] a:first-child button');
    await expect(page).not.toHaveURL(new RegExp(/\/custom-area\?.*/));
  });

  test('map settings is disabled when drawing tool is open', async ({ page }) => {
    await expect(page.getByTestId('map-settings-button')).toBeDisabled();
  });

  test('can draw a polygon', async ({ page }) => {
    const drawingTool = useDrawingTool(page);
    await drawingTool.enableDrawing();
    await drawingTool.draw();
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/.*\/custom-area\?bounds=.*/);
    await expect(page.getByText('Expand all widgets')).toBeVisible();
  });

  test('can upload a geojson file', async ({ page }) => {
    const drawingTool = useDrawingTool(page);
    await drawingTool.uploadGeojson('tests/documents/geojson.json');
    await expect(page).toHaveURL(/.*\/custom-area\?bounds=.*/);
    await expect(page.getByText('Expand all widgets')).toBeVisible();
  });

  test('will not upload a geojson file with wrong format', async ({ page }) => {
    const drawingTool = useDrawingTool(page);
    await drawingTool.uploadGeojson('tests/documents/geojson-incorrect.json');
    await expect(page).not.toHaveURL(/.*\/custom-area\?bounds=.*/);
    await expect(page.getByText('Expand all widgets')).not.toBeVisible();
  });
});

test.describe('Drawing Tool is open and has a polygon', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const drawingTool = useDrawingTool(page);
    await drawingTool.open();
    await drawingTool.uploadGeojson('tests/documents/geojson.json');
  });

  test('alert when leaving custom area clicking wordwise - cancel', async ({ page }) => {
    await useSidebar(page).clickWordwide();
    await expect(page.getByText('Reset the page and delete area').first()).toBeVisible();
    await page
      .getByText('Cancel', {
        exact: true,
      })
      .last()
      .click();
    await expect(page).toHaveURL(new RegExp(/\/custom-area\?.*/));
  });

  test('alert when leaving custom area clicking wordwise - accept', async ({ page }) => {
    await useSidebar(page).clickWordwide();
    await expect(page.getByText('Reset the page and delete area').first()).toBeVisible();
    await page
      .getByText('Reset page', {
        exact: true,
      })
      .last()
      .click();
    await expect(page).not.toHaveURL(new RegExp(/\/custom-area\?.*/));
  });

  test('alert when leaving custom area clicking search - accept and go to "Delta du Saloum" location', async ({
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
    await expect(page).not.toHaveURL(new RegExp(/\/custom-area\?.*/));
    await expect(page.getByTestId('location-dialog-content')).toBeVisible();
    await page.getByText('Delta du Saloum').last().click();
    await expect(page.locator('h1')).toHaveText('Delta du Saloum');
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
    await locationDialog.getByText('Close').click();
    await expect(page).not.toHaveURL(new RegExp(/\/custom-area\?.*/));
    await expect(page.locator('h1')).toHaveText('Worldwide');
  });

  test('can remove a polygon', async ({ page }) => {
    await page.getByTestId('delete-custom-area-button').click();
    await expect(page.getByTestId('delete-custom-area-button')).not.toBeVisible();
    await expect(page.getByTestId('start-drawing-button')).toBeVisible();
  });
});
