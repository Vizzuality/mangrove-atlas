import { widgetData } from '@/containers/datasets/habitat-change/hooks';

describe('habitat-change widgetData', () => {
  it('maps value → net_change, keeping name and iso', () => {
    const response = {
      data: [
        { name: 'Brazil', iso: 'BRA', value: 10 },
        { name: 'Nigeria', iso: 'NGA', value: -4 },
      ],
      metadata: { years: [], start_year: 0, end_year: 0, units: [] },
    };
    expect(widgetData(response)).toEqual([
      { name: 'Brazil', iso: 'BRA', net_change: 10 },
      { name: 'Nigeria', iso: 'NGA', net_change: -4 },
    ]);
  });

  it('returns undefined when there is no data', () => {
    expect(widgetData(undefined as never)).toBeUndefined();
  });
});
