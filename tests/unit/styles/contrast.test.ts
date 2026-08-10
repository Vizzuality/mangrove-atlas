import chroma from 'chroma-js';

import tailwindConfig from '../../../tailwind.config.mjs';

/**
 * Contrast guard for the design tokens.
 *
 * axe only ever sees the colours a given test route happens to render, so it
 * cannot tell us that a palette entry is unusable for text — it only tells us
 * that one particular node failed. This asserts the property at the source.
 *
 * WCAG 1.4.3: 4.5:1 for normal text, 3:1 for large text (>=18.66px bold or
 * >=24px). WCAG 1.4.11: 3:1 for UI components and graphical objects.
 */

const WHITE = '#ffffff';

const colors = (tailwindConfig as { theme: { extend: { colors: Record<string, unknown> } } }).theme
  .extend.colors;

const flatten = (input: Record<string, unknown>, prefix = ''): Record<string, string> =>
  Object.entries(input).reduce<Record<string, string>>((acc, [key, value]) => {
    const name = prefix ? `${prefix}-${key}` : key;
    if (typeof value === 'string') return { ...acc, [name]: value };
    return { ...acc, ...flatten(value as Record<string, unknown>, name) };
  }, {});

const PALETTE = flatten(colors as Record<string, unknown>);

/** Tokens the codebase uses to render body text on a white/near-white surface. */
const BODY_TEXT_TOKENS = ['black', 'grey-600', 'brand-800', 'brand-900'];

/** Tokens used for non-text UI on white: borders, icon fills, focus rings. */
const NON_TEXT_TOKENS = ['brand-800', 'grey-600'];

/**
 * Tokens that are decorative only — large fills, backgrounds, chart series.
 * Listed explicitly so that using one for text is a deliberate, visible choice
 * rather than an accident.
 */
const DECORATIVE_ONLY = [
  'grey-50',
  'grey-75',
  'grey-100',
  'grey-400',
  'grey-800',
  'brand-100',
  'brand-400',
  // 2.7:1 on white. Only ever used as a background fill or as an inset ring on
  // bg-brand-800 — never as a foreground on white.
  'brand-600',
  'blue-400',
  'yellow-400',
];

describe('palette contrast on white', () => {
  it.each(BODY_TEXT_TOKENS)('%s meets 4.5:1 for body text', (token) => {
    expect(PALETTE[token], `${token} is not defined in tailwind.config.mjs`).toBeDefined();
    expect(chroma.contrast(PALETTE[token], WHITE)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(NON_TEXT_TOKENS)('%s meets 3:1 for non-text UI', (token) => {
    expect(chroma.contrast(PALETTE[token], WHITE)).toBeGreaterThanOrEqual(3);
  });

  it('every palette token is classified', () => {
    const classified = new Set([...BODY_TEXT_TOKENS, ...NON_TEXT_TOKENS, ...DECORATIVE_ONLY]);
    const unclassified = Object.keys(PALETTE).filter((token) => !classified.has(token));

    // A new token must be deliberately placed in one of the three buckets, so
    // that adding an unreadable grey cannot slip in unnoticed.
    expect(unclassified).toEqual([]);
  });
});

describe('black alpha ramps used for text', () => {
  // Tailwind opacity utilities on `black` composited over white. These are the
  // ramps the widget styles use (text-black/85, /60) — /40 and /42 were 2.9:1
  // and 3.0:1 respectively and have been removed from text usage.
  it.each([
    [0.85, 4.5],
    [0.6, 4.5],
  ])('text-black/%s meets %s:1', (alpha, minimum) => {
    const composited = chroma.mix(WHITE, '#000000', alpha, 'rgb');
    expect(chroma.contrast(composited, WHITE)).toBeGreaterThanOrEqual(minimum);
  });
});
