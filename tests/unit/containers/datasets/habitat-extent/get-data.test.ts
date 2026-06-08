import { getHabitatExtentData } from '@/containers/datasets/habitat-extent/get-data';

const response = {
  data: [
    { year: 2010, indicator: 'linear_coverage', value: 20 },
    { year: 2020, indicator: 'habitat_extent_area', value: 50 },
    { year: 2020, indicator: 'linear_coverage', value: 30 },
  ],
  metadata: {
    total_lenght: 100,
    units: { habitat_extent_area: 'km²', linear_coverage: 'km' },
    year: [2010, 2020],
  },
} as never;

const base = {
  data: response,
  year: 2020,
  location: 'Brazil',
  noData: false,
  widgetSlug: 'habitat-extent',
};

describe('getHabitatExtentData', () => {
  it('shapes the selected year into legend + chart data (km²)', () => {
    const result = getHabitatExtentData({ ...base, unit: 'km²' });
    expect(result.defaultYear).toBe(2020);
    expect(result.totalLength).toBe('100.00');
    expect(result.area).toBe('50.00');
    expect(result.mangroveCoastCoveragePercentage).toBe('30.00');
    expect(result.nonMangrove).toBe('70.00');
    expect(result.legend[0].label).toBe('Coastline coverage in 2020');
    expect(result.chartData[0].value).toBe(30);
    expect(result.chartData[1].value).toBe(70);
    expect(result.config.chartBase.pies.value).toBe('habitat-extent');
    expect(result.location).toBe('Brazil');
    expect(result.unitOptions).toEqual(['km²', 'ha']);
    expect(result.noData).toBe(false);
  });

  it('scales coverage by 100 when unit is ha', () => {
    const result = getHabitatExtentData({ ...base, unit: 'ha' });
    expect(result.area).toBe('5,000.00');
    expect(result.chartData[0].value).toBe(3000);
    expect(result.chartData[1].value).toBe(7000);
  });
});
