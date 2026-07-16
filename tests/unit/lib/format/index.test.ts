import {
  adaptiveFormat,
  formatAxis,
  formatMillion,
  formatNumberNearestInteger,
  numberFormat,
  significantDigitsFormat,
} from '@/lib/format';

// d3-format uses the Unicode minus sign (U+2212), not the ASCII hyphen, for negatives.
const MINUS = '−';

describe('formatNumberNearestInteger', () => {
  it('rounds to the nearest integer with thousands separators', () => {
    expect(formatNumberNearestInteger(1234.6)).toBe('1,235');
    expect(formatNumberNearestInteger(1000000)).toBe('1,000,000');
  });

  it('keeps small sub-integer values visible instead of rounding them to "0"', () => {
    expect(formatNumberNearestInteger(0.3)).toBe('0.3');
    expect(formatNumberNearestInteger(0.006)).toBe('0.006');
    expect(formatNumberNearestInteger(0)).toBe('0');
  });

  it('keeps small negative sub-integer values visible with their sign', () => {
    expect(formatNumberNearestInteger(-0.3)).toBe(`${MINUS}0.3`);
    expect(formatNumberNearestInteger(-0.006)).toBe(`${MINUS}0.006`);
  });
});

describe('numberFormat', () => {
  it('formats with two decimals and thousands separators', () => {
    expect(numberFormat(1000)).toBe('1,000.00');
    expect(numberFormat(1.5)).toBe('1.50');
    expect(numberFormat(1.234)).toBe('1.23');
    expect(numberFormat(0)).toBe('0.00');
  });

  it('adds decimals so small values stay visible instead of rounding to "0.00"', () => {
    // 0.003 keeps three decimals, 0.006 is not rounded up to "0.01", etc.
    expect(numberFormat(0.003)).toBe('0.003');
    expect(numberFormat(0.006)).toBe('0.006');
    expect(numberFormat(0.00004)).toBe('0.00004');
  });

  it('applies the same rules to negative values, preserving the sign', () => {
    // Normal-range negatives keep two decimals; small negatives expand just like positives.
    expect(numberFormat(-1000)).toBe(`${MINUS}1,000.00`);
    expect(numberFormat(-1.234)).toBe(`${MINUS}1.23`);
    expect(numberFormat(-0.003)).toBe(`${MINUS}0.003`);
    expect(numberFormat(-0.006)).toBe(`${MINUS}0.006`);
    expect(numberFormat(-0.00004)).toBe(`${MINUS}0.00004`);
  });

  it('leaves non-finite input to d3 (no crash)', () => {
    expect(numberFormat(Number.NaN)).toBe('NaN');
  });
});

describe('adaptiveFormat', () => {
  it('respects the minDecimals baseline for normal-range values', () => {
    expect(adaptiveFormat(1234.5, 2)).toBe('1,234.50');
    expect(adaptiveFormat(0.5, 2)).toBe('0.50');
    expect(adaptiveFormat(1234.5, 0)).toBe('1,235');
  });

  it('expands to ~2 significant figures for small magnitudes (both signs)', () => {
    expect(adaptiveFormat(0.003, 2)).toBe('0.003');
    expect(adaptiveFormat(0.006, 0)).toBe('0.006');
    expect(adaptiveFormat(-0.003, 2)).toBe(`${MINUS}0.003`);
    expect(adaptiveFormat(-0.006, 0)).toBe(`${MINUS}0.006`);
  });

  it('caps expansion at 8 decimals for extreme values', () => {
    expect(adaptiveFormat(0.000000006, 2)).toBe('0.00000001');
  });
});

describe('formatAxis', () => {
  // Axes carry dates (years) — no adaptive small-value logic here, just the thousands
  // separator, exactly as before.
  it('formats integers (e.g. years) with thousands separators', () => {
    expect(formatAxis(2024)).toBe('2,024');
  });
});

describe('formatMillion', () => {
  it('formats with a forced mega (M) SI prefix', () => {
    expect(formatMillion(4000000)).toBe('4M');
  });
});

describe('significantDigitsFormat', () => {
  it('formats with three significant digits and an SI suffix', () => {
    expect(significantDigitsFormat(1234567)).toBe('1.23M');
  });
});
