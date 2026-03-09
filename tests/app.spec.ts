import { expect, test } from '@playwright/test';

import { dismissWelcomeDialog } from './fixtures/welcome-dialog';

test('Find broken images', async ({ page }) => {
  await page.goto('/');
  await dismissWelcomeDialog(page);
  await page.waitForLoadState('domcontentloaded');
  const images = page.locator('img');
  const allImages = await images.all();

  for (const image of allImages) {
    const src = await image.getAttribute('src');
    if (!src) continue;

    // Use API request instead of page.goto to avoid navigating away and invalidating locators
    const absoluteUrl = src.startsWith('http') ? src : new URL(src, page.url()).href;
    const response = await page.request.get(absoluteUrl);
    expect(response.status()).toBe(200);
  }
});
