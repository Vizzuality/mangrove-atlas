import { getBars, getColorKeys, getData } from '@/containers/datasets/height/hooks';

import type { Data } from './types';

const rows = [
  { indicator: '0-5', value: 25, year: 2020 },
  { indicator: '5-10', value: 75, year: 2020 },
] as unknown as Data[];

describe('getColorKeys', () => {
  it('maps each indicator to a color by position', () => {
    expect(getColorKeys(rows)).toEqual({ '0-5': '#C9BB42', '5-10': '#8BA205' });
  });
});

describe('getData', () => {
  const colors = getColorKeys(rows);

  it('returns null for empty input', () => {
    expect(getData([], 'm', colors)).toBeNull();
  });

  it('computes percentage-of-total per indicator', () => {
    const [row] = getData(rows, 'm', colors)! as Record<string, unknown>[];
    expect(row['0-5 m']).toBe('25.00');
    expect(row['5-10 m']).toBe('75.00');
    expect(row.year).toBe(2020);
    expect(row.label).toBe('5-10');
    expect(row.color).toBe('#8BA205');
  });
});

describe('getBars', () => {
  it('builds a bar config keyed by indicator', () => {
    const bars = getBars(rows, getColorKeys(rows));
    expect(bars['0-5 m']).toMatchObject({
      stackId: 'bar',
      barSize: 60,
      fill: '#C9BB42',
      isAnimationActive: false,
      indicator: 5,
    });
  });
});
