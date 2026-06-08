import { getColorKeys } from '@/containers/datasets/biomass/hooks';

import type { Data } from './types';

describe('biomass getColorKeys', () => {
  it('maps each indicator to a color by position', () => {
    const rows = [{ indicator: 'a' }, { indicator: 'b' }] as unknown as Data[];
    expect(getColorKeys(rows)).toEqual({ a: '#EAF19D', b: '#B8E98E' });
  });

  it('returns an empty map for no data', () => {
    expect(getColorKeys()).toEqual({});
  });
});
