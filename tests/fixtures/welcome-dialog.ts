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
    // Match either apostrophe form — the source uses U+2019 ("Let’s") but
    // older selectors used U+0027 ("Let's"). The mismatch silently burned
    // the full waitFor timeout on slow hydration (notably CI) and left the
    // dialog overlay up to block subsequent clicks for the 2-min test timeout.
    const exploreBtn = page.getByRole('button', { name: /Let.s explore the tool/ });
    await exploreBtn.waitFor({ timeout: 10000 });

    // Click the button to actually close the dialog. The earlier approach
    // (dispatch a synthetic 'storage' event so usehooks-ts re-reads
    // localStorage) updates `hasSeenWelcome` but doesn't close the dialog —
    // welcome-message/index.tsx only ever sets isOpen=true on that change,
    // never false — so the overlay would stay up and block later clicks.
    await exploreBtn.click();
    await exploreBtn.waitFor({ state: 'detached', timeout: 5000 });
  } catch {
    // Dialog didn't appear (fast hydration synced localStorage in time)
  }
}
