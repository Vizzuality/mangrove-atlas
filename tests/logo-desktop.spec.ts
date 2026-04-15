import { test } from './fixtures/test';

test('test logo links', async ({ page }) => {
  await page.goto('/?active=["mangrove_allen_coral_reef","mangrove_habitat_extent"]');

  const logoLink = page.getByTestId('desktop-logo');

  await logoLink.click();
  // The map's URL state syncing re-adds `bounds=` after the click, so an
  // exact `/` match races and times out on slower runs (notably Firefox).
  // Assert the navigation's actual intent: the `active` query was cleared.
  await page.waitForURL((url) => url.pathname === '/' && !url.searchParams.has('active'));
});
