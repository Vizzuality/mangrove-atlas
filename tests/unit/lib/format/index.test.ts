import {
  formatAxis,
  formatMillion,
  formatNumberNearestInteger,
  numberFormat,
  significantDigitsFormat,
} from '@/lib/format';

describe('formatNumberNearestInteger', () => {
  it('rounds to the nearest integer with thousands separators', () => {
    expect(formatNumberNearestInteger(1234.6)).toBe('1,235');
    expect(formatNumberNearestInteger(1000000)).toBe('1,000,000');
  });
});

describe('numberFormat', () => {
  it('formats with two decimals and thousands separators', () => {
    expect(numberFormat(1000)).toBe('1,000.00');
    expect(numberFormat(1.5)).toBe('1.50');
  });
});

describe('formatAxis', () => {
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
