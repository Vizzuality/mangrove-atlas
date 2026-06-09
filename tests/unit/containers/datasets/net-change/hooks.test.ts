import { getFormat, getWidgetData } from '@/containers/datasets/net-change/hooks';
import type { Data } from '@/containers/datasets/net-change/types';

const rows = [
  { year: 2000, net_change: 0, gain: 0, loss: 0 },
  { year: 2010, net_change: 5, gain: 8, loss: 3 },
  { year: 2020, net_change: -2, gain: 4, loss: 6 },
] as unknown as Data[];

describe('getFormat', () => {
  it('formats with decimals derived from magnitude', () => {
    expect(getFormat(0.5)).toBe('0.5');
    expect(getFormat(0.123)).toBe('0.1');
  });
});

describe('getWidgetData', () => {
  it('returns null for empty/nullish input', () => {
    expect(getWidgetData(null as unknown as Data[])).toBeNull();
    expect(getWidgetData([])).toBeNull();
  });

  it('orders rows ascending by year', () => {
    const result = getWidgetData(rows)!;
    expect(result.map((r) => r.year)).toEqual([2000, 2010, 2020]);
  });

  it('zeroes gain/loss for the first year and negates loss otherwise', () => {
    const result = getWidgetData(rows)!;
    expect(result[0].Gain).toBe(0);
    expect(result[0].Loss).toBe(0);
    expect(result[1].Gain).toBe(8);
    expect(result[1].Loss).toBe(-3);
  });

  it('scales gain/loss by 100 when unit is ha', () => {
    const km = getWidgetData(rows)!;
    const ha = getWidgetData(rows, 'ha')!;
    expect(ha[1].Gain).toBe(km[1].Gain * 100);
    expect(ha[1].Loss).toBe(km[1].Loss * 100);
  });

  it('attaches a Net change settings entry carrying the unit', () => {
    const result = getWidgetData(rows, 'ha')!;
    expect(result[1].settings[0].label).toBe('Net change');
    expect(result[1].settings[0].unit).toBe('ha');
    expect(result[1].direction).toBe('vertical');
  });
});
