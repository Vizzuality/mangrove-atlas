import { test, expect } from '@playwright/test';

// test('Menu', async ({ page }) => {
//   await page.goto('/');
//   await page.getByTestId('menu_button').click();
//   await expect(page.getByTestId('menu_content')).toBeVisible();

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});

// test('activate layer', async ({ page }) => {
//   await page.goto('/');
//   await page.getByTestId('mangrove_extent').click();

//   const layerSwitch = page.getByTestId('mangrove_extent');
//   await expect(layerSwitch).toHaveAttribute('data-state', 'checked');
//   await expect(page).toHaveURL(/.*?active=\[mangrove_extent\]/);
// });
