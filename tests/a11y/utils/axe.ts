import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import type { Result } from 'axe-core';

import { getKnownIssues } from '../known-issues';

export const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] as const;

interface ScanOptions {
  /**
   * Key into `known-issues.ts`. Rules listed there are disabled for this scan
   * and each entry names the phase that deletes it.
   */
  route: string;
  /** Restrict the scan to a CSS selector (e.g. a single dialog). */
  include?: string;
  /** Exclude a CSS selector — use for third-party widgets we do not own. */
  exclude?: string;
  /** Extra rules to disable for this scan only, beyond the ledger. */
  disableRules?: string[];
}

function formatViolations(violations: Result[]): string {
  return violations
    .map((violation) => {
      const nodes = violation.nodes
        .map((node) => `      - ${node.target.join(' ')}\n        ${node.failureSummary ?? ''}`)
        .join('\n');
      return `  [${violation.impact ?? 'unknown'}] ${violation.id}: ${violation.help}\n    ${
        violation.helpUrl
      }\n${nodes}`;
    })
    .join('\n\n');
}

/**
 * Run axe against the current page state and assert there are no violations.
 *
 * Always attaches the full violation list to the Playwright report before
 * asserting — a bare "expected 0, got 7" tells you nothing about which nodes
 * failed, and the HTML report is where anyone debugging a CI failure looks.
 */
export async function expectNoViolations(page: Page, options: ScanOptions): Promise<void> {
  const disabled = [...getKnownIssues(options.route), ...(options.disableRules ?? [])];

  let builder = new AxeBuilder({ page }).withTags([...WCAG_TAGS]);

  if (options.include) builder = builder.include(options.include);
  if (options.exclude) builder = builder.exclude(options.exclude);
  if (disabled.length > 0) builder = builder.disableRules(disabled);

  const results = await builder.analyze();

  await test.info().attach(`axe-${options.route.replace(/[^a-z0-9]+/gi, '-')}`, {
    body: JSON.stringify(results.violations, null, 2),
    contentType: 'application/json',
  });

  expect(
    results.violations,
    results.violations.length === 0
      ? 'no accessibility violations'
      : `Accessibility violations on ${options.route}:\n\n${formatViolations(results.violations)}\n`
  ).toEqual([]);
}
