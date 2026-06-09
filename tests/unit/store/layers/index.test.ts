import { parseAsLayers } from '@/store/layers';

describe('parseAsLayers', () => {
  it('parses a valid JSON layers array', () => {
    const layers = [{ id: 'mangrove_net_change', opacity: '0.5', visibility: 'visible' }];
    expect(parseAsLayers.parse(JSON.stringify(layers))).toEqual(layers);
  });

  it('falls back to the default layer on invalid JSON', () => {
    expect(parseAsLayers.parse('broken')).toEqual([
      { id: 'mangrove_habitat_extent', opacity: '1', visibility: 'visible' },
    ]);
  });

  it('round-trips through serialize', () => {
    const layers = [{ id: 'mangrove_biomass', opacity: '1', visibility: 'none' }];
    expect(parseAsLayers.parse(parseAsLayers.serialize(layers as never))).toEqual(layers);
  });
});
