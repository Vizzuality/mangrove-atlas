export function coverageFilter({ year }) {
  return [
    'all',
    [
      'match',
      ['get', 'year'],
      [year],
      true,
      false
    ]
  ];
}

export function netChangeFilter({ startYear, endYear }) {
  if (startYear === endYear) {
    return ['boolean', false];
  }

  const availableYears = ['1996', '2007', '2008', '2009', '2010', '2015', '2016'];

  const years = availableYears
    .filter(y => parseInt(y, 10) >= parseInt(startYear, 10))
    .filter(y => parseInt(y, 10) < parseInt(endYear, 10));

  return [
    'all',
    [
      'match',
      ['get', 'start_year'],
      years,
      true,
      false
    ]
  ];
}

export default {
  coverageFilter,
  netChangeFilter
};
