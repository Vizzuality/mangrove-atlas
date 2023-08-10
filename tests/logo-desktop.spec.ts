import { test } from '@playwright/test';

test('test logo links', async ({ page }) => {
  await page.goto('/?active=["mangrove_allen_coral_reef","mangrove_habitat_extent"]');

  const logoLink = page.getByTestId('desktop-logo');

  await logoLink.click();
  await page.waitForURL('/');
});
