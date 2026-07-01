import {
  getEvenlySpacedTicks,
  getFormat,
  getNetChangeSources,
  getWidgetData,
  mockGainLoss,
} from '@/containers/datasets/net-change/hooks';
import type { Data } from '@/containers/datasets/net-change/types';

// The raster member of react-map-gl's SourceProps union — the only variant
// getNetChangeSources emits. Narrow to it so `tiles` is accessible in asserts.
type RasterSource = { id: string; type: 'raster'; tiles: string[] };

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

  it('attaches Gain, Loss and Net result settings entries carrying the unit', () => {
    const result = getWidgetData(rows, 'ha')!;
    expect(result[1].settings.map((s) => s.label)).toEqual(['Net result', 'Loss', 'Gain']);
    expect(result[1].settings.every((s) => s.unit === 'ha')).toBe(true);
    expect(result[1].direction).toBe('horizontal');
  });

  it('exposes the cumulative net result under the Net result key', () => {
    const result = getWidgetData(rows)!;
    // cumulative: [0, 0+5, 5+(-2)] = [0, 5, 3]
    expect(result[0]['Net result']).toBe(0);
    expect(result[1]['Net result']).toBe(5);
    expect(result[2]['Net result']).toBe(3);
  });
});

describe('getEvenlySpacedTicks', () => {
  it('returns the values unchanged when they already fit within maxTicks', () => {
    expect(getEvenlySpacedTicks([1996, 2000, 2004], 5)).toEqual([1996, 2000, 2004]);
  });

  it('always includes the first and last value', () => {
    const years = [1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025];
    const ticks = getEvenlySpacedTicks(years, 5);
    expect(ticks[0]).toBe(1985);
    expect(ticks[ticks.length - 1]).toBe(2025);
  });

  it('returns at most maxTicks evenly spaced (by index) values', () => {
    const years = Array.from({ length: 40 }, (_, i) => 1986 + i); // 1986..2025
    const ticks = getEvenlySpacedTicks(years, 5);
    expect(ticks).toEqual([1986, 1996, 2006, 2015, 2025]);
  });

  it('dedupes when rounding lands on the same index', () => {
    const ticks = getEvenlySpacedTicks([2019, 2020, 2021, 2022], 6);
    expect(ticks).toEqual([...new Set(ticks)]);
  });

  it('is safe for empty/nullish input', () => {
    expect(getEvenlySpacedTicks([], 5)).toEqual([]);
    expect(getEvenlySpacedTicks(undefined as unknown as number[], 5)).toEqual([]);
  });
});

describe('getNetChangeSources', () => {
  const years = [1986, 1996, 2007, 2015, 2020, 2025];

  it('builds one combined raster source per year in the (start, end] window', () => {
    const sources = getNetChangeSources(years, 1996, 2020);
    // exclusive lower bound (1996 dropped), inclusive upper bound (2020 kept)
    expect(sources.map((s) => s.id)).toEqual([
      'net-change-2007',
      'net-change-2015',
      'net-change-2020',
    ]);
  });

  it('points each source at the gain-loss-v4 combined tileset for its year', () => {
    const [source] = getNetChangeSources(years, 1996, 2020) as RasterSource[];
    expect(source).toMatchObject({
      id: 'net-change-2007',
      type: 'raster',
      minZoom: 0,
      maxZoom: 12,
    });
    expect(source.tiles).toEqual([
      'https://storage.googleapis.com/mangrove_atlas/staging/tilesets/gain-loss-v4/2007/{z}/{x}/{y}.png',
    ]);
  });

  it('emits a single source per year (no separate gain/loss)', () => {
    const sources = getNetChangeSources(years, 2015, 2025) as RasterSource[];
    expect(sources).toHaveLength(2); // 2020, 2025
    expect(sources.every((s) => s.tiles?.length === 1)).toBe(true);
    expect(sources.every((s) => !/\/(gain|loss)\//.test(s.tiles[0]))).toBe(true);
  });

  it('excludes the start year and returns empty when the window is degenerate', () => {
    expect(getNetChangeSources(years, 2025, 2025)).toEqual([]);
  });
});

describe('mockGainLoss', () => {
  it('produces gain/loss whose difference equals net_change', () => {
    for (const net of [-2631.47, -1.5, 0, 51.08, 293.95]) {
      const { gain, loss } = mockGainLoss(net);
      expect(gain - loss).toBeCloseTo(net, 6);
    }
  });

  it('returns non-negative, deterministic values', () => {
    const a = mockGainLoss(-433.07);
    const b = mockGainLoss(-433.07);
    expect(a).toEqual(b);
    expect(a.gain).toBeGreaterThanOrEqual(0);
    expect(a.loss).toBeGreaterThanOrEqual(0);
  });
});
