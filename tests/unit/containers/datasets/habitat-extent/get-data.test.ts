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

describe('getHabitatExtentData — never renders "NaN"', () => {
  // Analysis API (custom areas / MRTT sites): area only, no coastline fields.
  const analysisResponse = {
    data: [
      { year: 2020, indicator: 'habitat_extent_area', value: 12.5 },
      { year: 2024, indicator: 'habitat_extent_area', value: 13 },
    ],
    metadata: { units: { habitat_extent_area: 'km²' }, year: [2020, 2024] },
  } as never;

  const strings = (result: ReturnType<typeof getHabitatExtentData>) =>
    JSON.stringify([
      result.area,
      result.nonMangrove,
      result.totalLength,
      result.mangroveCoastCoveragePercentage,
      result.legend,
      result.chartData.map(({ settings }) => settings),
    ]);

  it('formats the area of an analysis response and leaves coastline values null', () => {
    const result = getHabitatExtentData({ ...base, data: analysisResponse, unit: 'km²' });
    expect(result.area).toBe('12.50');
    expect(result.nonMangrove).toBeNull();
    expect(result.totalLength).toBeNull();
    expect(strings(result)).not.toMatch(/NaN|Infinity/);
  });

  it('falls back to the latest year when the selected year is not in the response', () => {
    // e.g. a year picked for a country, carried over to a custom area.
    const result = getHabitatExtentData({
      ...base,
      data: analysisResponse,
      year: 1996,
      unit: 'km²',
    });
    expect(result.defaultYear).toBe(2024);
    expect(result.area).toBe('13.00');
  });

  it('returns a null area (not "NaN") for an empty or failed response', () => {
    for (const data of [undefined, { data: [], metadata: { units: {} } }] as never[]) {
      const result = getHabitatExtentData({ ...base, data, unit: 'ha' });
      expect(result.area).toBeNull();
      expect(strings(result)).not.toMatch(/NaN|Infinity/);
    }
  });
});
