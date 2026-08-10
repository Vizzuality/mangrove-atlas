/**
 * Axe rules that are knowingly failing, per route.
 *
 * This ledger exists so the a11y harness can land green *before* the fixes,
 * and then tighten monotonically: every remediation phase deletes its own
 * entries, and a phase is not done until they are gone. The alternative —
 * landing the specs red — reliably ends with the whole suite muted.
 *
 * Every entry MUST name the phase that removes it. When this object is empty,
 * delete the file and the `getKnownIssues` call in `utils/axe.ts`.
 */
const KNOWN_ISSUES: Record<string, string[]> = {
  '/': [
    // Phase 1C — text-black/42 in legend controls, text-grey-400 in the
    // species-threatened legend, opacity-30 legend subtitle.
    'color-contrast',
    // Phase 4C — icon-only buttons in the map legend and the news tooltip.
    'button-name',
    // Phase 5C — h3 before h2 in containers/legend, h5 news post titles.
    'heading-order',
  ],
  '/country/IDN': [
    // Phase 1C — see '/'.
    'color-contrast',
    // Phase 4C — see '/'.
    'button-name',
    // Phase 5C — see '/'.
    'heading-order',
  ],
  '/embedded': [
    // Phase 1C — shared widget styles.
    'color-contrast',
  ],
  '/print-report': [
    // Phase 1C — shared widget styles.
    'color-contrast',
    // Phase 5C — h3 under h1 in print-report, h4 in print-legend.
    'heading-order',
  ],
  '/auth/signin': [
    // Phase 5C — hero h2 renders before the page h1.
    'heading-order',
  ],
  '/auth/signup': [
    // Phase 3B — the privacy-policy checkbox is wrapped in a <button> and its
    // <label htmlFor> targets a Radix button, so it has no accessible name.
    'label',
    'nested-interactive',
  ],
  '/auth/forgot-password': [],
  '/404': [
    // Phase 1C — text-grey-800 body copy on the error page.
    'color-contrast',
  ],
};

export function getKnownIssues(route: string): string[] {
  return KNOWN_ISSUES[route] ?? [];
}

export default KNOWN_ISSUES;
