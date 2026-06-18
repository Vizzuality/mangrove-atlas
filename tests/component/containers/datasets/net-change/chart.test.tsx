import { render } from '@testing-library/react';

import NetChangeChart from '@/containers/datasets/net-change/chart';

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

const data = [
  { year: 2010, 'Net result': 0, Gain: 0, Loss: 0 },
  { year: 2011, 'Net result': 5, Gain: 8, Loss: -3 },
  { year: 2012, 'Net result': 3, Gain: 4, Loss: -6 },
];

const config = {
  type: 'composed',
  data,
  chartBase: { bars: { Gain: {}, Loss: {} }, lines: { 'Net result': {} } },
  cartesianGrid: {},
};

const configBrush = {
  type: 'composed',
  data,
  height: 104,
  margin: { top: 4, right: 20, bottom: 32, left: 15 },
  overlayMargin: { top: 4, right: 20, bottom: 42, left: 15 },
  xKey: 'year',
  xAxis: { type: 'category', dataKey: 'year' },
  chartBase: { bars: { Gain: {}, Loss: {} }, lines: { 'Net result': {} } },
  startIndex: 0,
  endIndex: 2,
};

describe('NetChangeChart brush', () => {
  it('renders the brush svg when configBrush is set', () => {
    const { container } = render(
      <NetChangeChart config={config} configBrush={configBrush} onBrushEnd={() => {}} />
    );
    expect(container.querySelector('.c-brush')).not.toBeNull();
  });
  it('does not render brush without configBrush', () => {
    const { container } = render(<NetChangeChart config={config} />);
    expect(container.querySelector('.c-brush')).toBeNull();
  });
});
