import { cloneElement, isValidElement } from 'react';

import { render } from '@testing-library/react';

import Chart from '@/components/chart';

// Recharts' ResponsiveContainer measures 0x0 under jsdom, so nothing renders.
// Replace it with a passthrough that hands the chart a fixed size.
vi.mock('recharts', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
      isValidElement(children)
        ? cloneElement(children as React.ReactElement, { width: 200, height: 200 })
        : children,
  };
});

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

const data = [
  { label: 'Mangroves', percentage: 70, color: '#EE4D5A' },
  { label: 'Non mangroves', percentage: 30, color: '#ECECEF' },
];

const config = {
  type: 'pie',
  width: 200,
  height: 200,
  data,
  // Disable the enter animation so the sector paths are drawn on first render.
  chartBase: { pies: { percentage: { isAnimationActive: false } } },
};

describe('Pie chart accessibility', () => {
  it('gives each sector an accessible name from its data label', () => {
    const { container } = render(<Chart config={config} />);
    const sectors = Array.from(container.querySelectorAll('path.recharts-sector'));

    expect(sectors).toHaveLength(data.length);
    expect(sectors.map((s) => s.getAttribute('aria-label'))).toEqual([
      'Mangroves',
      'Non mangroves',
    ]);
  });
});
