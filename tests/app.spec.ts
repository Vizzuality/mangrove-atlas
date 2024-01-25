import { expect, test } from '@playwright/test';

test('Find broken images', async ({ page }) => {
  await page.goto('*');
  await page.waitForLoadState('domcontentloaded');
  const images = page.locator('img');
  const allImages = await images.all();

  for await (const image of allImages) {
    const src = await image.getAttribute('src');
    const response = await page.goto(src);
    const status = response?.status();
    expect(status).toBe(200);
  }
});
