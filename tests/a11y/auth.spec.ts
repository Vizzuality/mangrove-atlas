import { expect, test } from '../fixtures/test';

import { expectNoViolations } from './utils/axe';

const AUTH_ROUTES = ['/auth/signin', '/auth/signup', '/auth/forgot-password'] as const;

test.describe('a11y: auth pages', () => {
  for (const route of AUTH_ROUTES) {
    test(`${route} has no WCAG violations`, async ({ page }) => {
      await page.goto(route);
      // Auth pages are client components behind a form — the submit button is
      // the last thing to render, so it is the reliable settle signal. Matched
      // by type rather than by name: the three pages label it "Log in",
      // "Register" and "Submit", and the copy is translated.
      await expect(page.locator('main#main-content button[type="submit"]')).toBeVisible();

      await expectNoViolations(page, { route });
    });

    test(`${route} exposes a main landmark for the skip link`, async ({ page }) => {
      // Exactly one: each auth page marks its own form column, so a stray
      // wrapper landmark in the shared layout would show up as a second.
      await page.goto(route);
      await expect(page.locator('main#main-content')).toHaveCount(1);
    });
  }
});
