import { normalize, sortObject } from '@/lib/utils';

describe('normalize', () => {
  it('strips accents/diacritics', () => {
    expect(normalize('Café')).toBe('cafe');
    expect(normalize('Açúcar')).toBe('acucar');
  });

  it('trims and lowercases', () => {
    expect(normalize('  Hello World  ')).toBe('hello world');
  });

  it('handles an empty string', () => {
    expect(normalize('')).toBe('');
  });
});

describe('sortObject', () => {
  it('sorts keys by normalized order', () => {
    const result = sortObject({ Zebra: [], Açúcar: [], banana: [] });
    expect(Object.keys(result)).toEqual(['Açúcar', 'banana', 'Zebra']);
  });

  it('sorts each array value by normalized order', () => {
    const result = sortObject({ fruits: ['Zebra', 'Ávila', 'banana'] });
    expect(result.fruits).toEqual(['Ávila', 'banana', 'Zebra']);
  });

  it('does not mutate the input arrays', () => {
    const input = { fruits: ['Zebra', 'apple'] };
    sortObject(input);
    expect(input.fruits).toEqual(['Zebra', 'apple']);
  });
});
