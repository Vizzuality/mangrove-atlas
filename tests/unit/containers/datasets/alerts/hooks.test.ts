import { getBrushYearLabelIndices } from '@/containers/datasets/alerts/hooks';

describe('getBrushYearLabelIndices', () => {
  it('returns no indices for an empty series', () => {
    expect(getBrushYearLabelIndices([])).toEqual([]);
  });

  it('labels every point when there are fewer points than maxLabels', () => {
    expect(getBrushYearLabelIndices([2019, 2020, 2021])).toEqual([0, 1, 2]);
  });

  it('picks evenly spaced slots and drops consecutive repeated years', () => {
    // Sparse monthly series (à la The Gambia): 27 points, months missing, so
    // years cover uneven index ranges.
    const years = [
      2019, 2019, 2019, 2020, 2020, 2021, 2021, 2021, 2021, 2021, 2021, 2021, 2021, 2022, 2022,
      2022, 2022, 2023, 2023, 2023, 2023, 2024, 2024, 2024, 2024, 2024, 2024,
    ];
    // 8 slots over 27 points -> indices [0, 4, 7, 11, 15, 19, 22, 26]; 11 and
    // 26 repeat the year of the previously kept slot and are dropped, leaving
    // every year labelled once on an even grid.
    expect(getBrushYearLabelIndices(years)).toEqual([0, 4, 7, 15, 19, 22]);
  });

  it('collapses to a single label when every point shares one year', () => {
    expect(getBrushYearLabelIndices([2020, 2020, 2020, 2020])).toEqual([0]);
  });
});
