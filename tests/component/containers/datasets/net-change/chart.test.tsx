import { render } from '@testing-library/react';

import NetChangeChart from '@/containers/datasets/net-change/chart';

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

const config = {
  type: 'composed',
  data: [
    { year: 2010, 'Net result': 0, Gain: 0, Loss: 0 },
    { year: 2011, 'Net result': 5, Gain: 8, Loss: -3 },
    { year: 2012, 'Net result': 3, Gain: 4, Loss: -6 },
  ],
  chartBase: { bars: { Gain: {}, Loss: {} }, lines: { 'Net result': {} } },
  cartesianGrid: {},
  brush: { startIndex: 0, endIndex: 2, onBrushEnd: () => {} },
};

describe('NetChangeChart brush', () => {
  it('renders the brush svg when config.brush is set', () => {
    const { container } = render(<NetChangeChart config={config} />);
    expect(container.querySelector('.c-brush')).not.toBeNull();
  });
  it('does not render brush without config.brush', () => {
    const { container } = render(<NetChangeChart config={{ ...config, brush: undefined }} />);
    expect(container.querySelector('.c-brush')).toBeNull();
  });
});
