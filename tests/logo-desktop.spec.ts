import { test } from './fixtures/test';

test('test logo links', async ({ page }) => {
  await page.goto('/');

  const logoLink = page.getByTestId('desktop-logo');

  await logoLink.click();
  // The map's URL state syncing re-adds `bounds=` after the click, so an
  // exact `/` match races and times out on slower runs (notably Firefox).
  // Assert only that the pathname returned to '/'.
  await page.waitForURL((url) => url.pathname === '/');
});
