import { expect, test } from '../fixtures/test';

import { expectNoViolations } from './utils/axe';

const AUTH_ROUTES = ['/auth/signin', '/auth/signup', '/auth/forgot-password'] as const;

test.describe('a11y: auth pages', () => {
  for (const route of AUTH_ROUTES) {
    test(`${route} has no WCAG violations`, async ({ page }) => {
      await page.goto(route);
      // Auth pages are client components behind a form — the submit button is
      // the last thing to render, so it is the reliable settle signal.
      await expect(
        page.getByRole('button', { name: /sign in|sign up|send|reset/i }).first()
      ).toBeVisible();

      await expectNoViolations(page, { route });
    });

    test(`${route} exposes a main landmark for the skip link`, async ({ page }) => {
      // Unblocked by phase 5B (src/app/auth/layout.tsx). Auth pages currently
      // use <section>, so the root layout's skip link points at nothing here.
      test.fixme(true, 'No <main id="main-content"> on auth routes until phase 5B');
      await page.goto(route);
      await expect(page.locator('main#main-content')).toHaveCount(1);
    });
  }
});
