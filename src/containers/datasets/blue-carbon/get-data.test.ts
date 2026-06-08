import { getBlueCarbonData } from '@/containers/datasets/blue-carbon/get-data';

import type { DataResponse } from './types';

const response = {
  data: [
    { indicator: '700-1400', value: 30 },
    { indicator: '0-700', value: 70 },
  ],
  metadata: { agb: 2_000_000, toc: 4_000_000, soc: 6_000_000 },
} as unknown as DataResponse;

describe('getBlueCarbonData', () => {
  it('orders by carbon-density band and computes percentages', () => {
    const result = getBlueCarbonData(response, 'Brazil');
    expect(result.config.data.map((d) => d.label)).toEqual(['0-700', '700-1400']);
    expect(result.config.data[0].value).toBe(70);
    expect(result.config.data[0].color).toBe('#EEB66B');
    expect(result.config.data[0].percentage).toBe('70.00');
    expect(result.config.data[1].percentage).toBe('30.00');
  });

  it('formats agb/toc/soc to Mt (nearest integer) and carries location', () => {
    const result = getBlueCarbonData(response, 'Brazil');
    expect(result.agb).toBe('2');
    expect(result.toc).toBe('4');
    expect(result.soc).toBe('6');
    expect(result.location).toBe('Brazil');
    expect(result.noData).toBe(false);
  });

  it('flags noData for an empty response', () => {
    const empty = { data: [], metadata: { agb: 0, toc: 0, soc: 0 } } as unknown as DataResponse;
    expect(getBlueCarbonData(empty, 'X').noData).toBe(true);
  });
});
