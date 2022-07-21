import { select } from 'redux-saga/effects';

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

export function* netChangeFilter({ startYear, endYear }) {

  const { widgets: { ui: { net }} } = yield select();

  if (startYear === endYear) {
    return ['boolean', false];
  }

  const availableYears = net?.years;

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
