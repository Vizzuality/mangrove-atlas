import { Page } from '@playwright/test';

/**
 * Dismiss the welcome dialog that appears during hydration.
 *
 * usehooks-ts v2.9.1 useLocalStorage uses useState+useEffect (not
 * useSyncExternalStore), so the SSR default (false) is reused during
 * hydration even when localStorage has `welcomeIntroMessage: "true"`.
 * The dialog always opens briefly.
 *
 * IMPORTANT: Must click "Let's explore the tool" button to dismiss.
 * Using keyboard Escape or overlay clicks triggers a "Snapshot has
 * already been released" Recoil runtime error in Firefox.
 */
export async function dismissWelcomeDialog(page: Page) {
  try {
    const exploreBtn = page.getByRole('button', { name: "Let's explore the tool" });
    await exploreBtn.waitFor({ timeout: 10000 });

    // Dismiss by syncing localStorage directly rather than clicking the button.
    // Clicking ANY dismiss method (button, Escape, overlay) triggers a
    // "Snapshot has already been released" Recoil crash in Firefox.
    // Dispatching a storage event makes usehooks-ts re-read localStorage
    // and close the dialog without Radix Dialog's close codepath.
    await page.evaluate(() => {
      localStorage.setItem('welcomeIntroMessage', 'true');
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'welcomeIntroMessage',
          newValue: 'true',
          storageArea: localStorage,
        })
      );
    });

    // Wait for the dialog to unmount
    await exploreBtn.waitFor({ state: 'detached', timeout: 5000 });
  } catch {
    // Dialog didn't appear (fast hydration synced localStorage in time)
  }
}
