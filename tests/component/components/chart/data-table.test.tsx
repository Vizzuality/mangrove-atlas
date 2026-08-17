import { render, screen } from '@testing-library/react';

import ChartDataTable from '@/components/chart/data-table';

// A monthly series charted against `year` — the shape the alerts and net-change
// brushes pass in, where the x value repeats for every month of the same year.
const monthlyRows = [
  { year: 2025, alerts: 10 },
  { year: 2025, alerts: 20 },
  { year: 2026, alerts: 30 },
  { year: 2026, alerts: 40 },
];

describe('ChartDataTable', () => {
  it('renders one row per data point when the x value repeats, without duplicate keys', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ChartDataTable data={monthlyRows} xKey="year" seriesKeys={['alerts']} caption="Alerts" />
    );

    // header row + one row per data point
    expect(screen.getAllByRole('row')).toHaveLength(monthlyRows.length + 1);
    expect(screen.getAllByRole('rowheader').map((th) => th.textContent)).toEqual([
      '2025',
      '2025',
      '2026',
      '2026',
    ]);
    expect(screen.getAllByRole('cell').map((td) => td.textContent)).toEqual([
      '10',
      '20',
      '30',
      '40',
    ]);
    expect(error.mock.calls.flat().join(' ')).not.toContain('same key');

    error.mockRestore();
  });

  it('names rows by position when they carry no label at all', () => {
    render(
      <ChartDataTable
        data={[{ alerts: 1 }, { alerts: 2 }]}
        seriesKeys={['alerts']}
        caption="Alerts"
      />
    );

    expect(screen.getAllByRole('rowheader').map((th) => th.textContent)).toEqual([
      'Row 1',
      'Row 2',
    ]);
  });
});
