import { test as base, expect } from '@playwright/test';

/**
 * Custom test fixture providing two invariants for every test:
 *
 * 1. **Pre-hydration localStorage.** `addInitScript` runs in the browser
 *    *after the document is created but before any page scripts*, so
 *    React/usehooks-ts `useState` initializers read the intended values
 *    on their first invocation. This eliminates the hydration race that
 *    caused the welcome dialog to flash open — and its overlay to block
 *    subsequent clicks — in slow environments (CI runners).
 *
 *    Previously the fixture relied on Playwright's `storageState` JSON
 *    plus a post-hoc `dismissWelcomeDialog` click. Both are racy: the
 *    storage file applies at context creation (fine), but the dialog
 *    still has a moment where React hydrates with the SSR default, and
 *    if that moment lasts longer than our dismissal-fixture waitFor, the
 *    overlay stays up and every later click times out.
 *
 * 2. **Fail on uncaught page errors.** `page.on('pageerror')` catches
 *    uncaught exceptions in page JS. If React fails to hydrate or a
 *    script throws, the test fails with the real error instead of a
 *    two-minute click timeout masking it.
 *
 *    We deliberately do *not* fail on `console.error` messages — third-
 *    party libraries emit noisy but harmless errors. Tighten later if
 *    we want stricter behavior.
 *
 * Use in specs:
 *
 *     import { test, expect } from './fixtures/test';
 *
 * Not `@playwright/test`.
 */
export const test = base.extend({
  page: async ({ page, context }, use) => {
    await context.addInitScript(() => {
      try {
        window.localStorage.setItem('welcomeIntroMessage', 'true');
        window.localStorage.setItem('guideLocalStorage', 'true');
      } catch {
        // about:blank and similar have no accessible localStorage — ignore.
      }
    });

    const pageErrors: Error[] = [];
    const consoleErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // `use` here is Playwright's fixture teardown callback (awaiting it runs
    // the test body; anything after is teardown). It is NOT the React `use`
    // hook — the rules-of-hooks rule false-positives on the name.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);

    // Attach console errors to the report (non-failing) for visibility.
    if (consoleErrors.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`Page console.error during test:\n${consoleErrors.join('\n')}`);
    }
    if (pageErrors.length > 0) {
      const messages = pageErrors.map((e) => e.stack || e.message).join('\n---\n');
      throw new Error(
        `Page produced ${pageErrors.length} uncaught error(s) during test:\n${messages}`
      );
    }
  },
});

export { expect };
