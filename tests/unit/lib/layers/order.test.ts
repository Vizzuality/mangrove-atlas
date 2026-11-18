import { insertLayer, normalizeLayers, reorderSubset, toggleLayer } from '@/lib/layers/order';

const l = (id: string) => ({ id });
const ids = (layers: { id: string }[]) => layers.map((layer) => layer.id);

const HI_RES = 'hi-res-extent';
const EXTENT = 'mangrove_habitat_extent';
const NET = 'mangrove_net_change';
const ALERTS = 'mangrove_alerts';
const WDPA = 'mangrove_protected_areas';
const PLANET_V = 'planet_medres_visual_monthly';
const PLANET_A = 'planet_medres_analytic_monthly';

describe('insertLayer', () => {
  it('puts a new data layer on top', () => {
    expect(ids(insertLayer([l(EXTENT)], l(NET)))).toEqual([NET, EXTENT]);
  });

  it('puts a new data layer below a detail layer on top', () => {
    expect(ids(insertLayer([l(HI_RES), l(NET)], l(ALERTS)))).toEqual([HI_RES, ALERTS, NET]);
  });

  it('puts a detail layer on top when its parent is not active', () => {
    expect(ids(insertLayer([l(NET), l(WDPA)], l(HI_RES)))).toEqual([HI_RES, NET, WDPA]);
  });

  it('puts a detail layer directly above its active parent', () => {
    expect(ids(insertLayer([l(NET), l(EXTENT), l(WDPA)], l(HI_RES)))).toEqual([
      NET,
      HI_RES,
      EXTENT,
      WDPA,
    ]);
  });

  it('puts a parent turned on after its detail layer directly below it', () => {
    expect(ids(insertLayer([l(HI_RES), l(NET)], l(EXTENT)))).toEqual([HI_RES, EXTENT, NET]);
    expect(ids(insertLayer([l(NET), l(HI_RES), l(WDPA)], l(EXTENT)))).toEqual([
      NET,
      HI_RES,
      EXTENT,
      WDPA,
    ]);
  });

  it('puts a context layer below data layers and above background', () => {
    expect(ids(insertLayer([l(NET), l(EXTENT), l(PLANET_V)], l(WDPA)))).toEqual([
      NET,
      EXTENT,
      WDPA,
      PLANET_V,
    ]);
  });

  it('puts a context layer at the end when there is no context or background', () => {
    expect(ids(insertLayer([l(NET)], l(WDPA)))).toEqual([NET, WDPA]);
  });

  it('puts a background layer last and swaps the other background out', () => {
    expect(ids(insertLayer([l(PLANET_V), l(NET), l(WDPA)], l(PLANET_A)))).toEqual([
      NET,
      WDPA,
      PLANET_A,
    ]);
  });

  it('keeps a single entry when the layer is already active', () => {
    expect(ids(insertLayer([l(NET), l(EXTENT)], l(EXTENT)))).toEqual([EXTENT, NET]);
  });
});

describe('toggleLayer', () => {
  it('removes an active layer', () => {
    expect(ids(toggleLayer([l(HI_RES), l(EXTENT)], l(HI_RES)))).toEqual([EXTENT]);
  });

  it('inserts an inactive layer by type', () => {
    expect(ids(toggleLayer([l(EXTENT)], l(HI_RES)))).toEqual([HI_RES, EXTENT]);
  });
});

describe('normalizeLayers', () => {
  it('moves background layers to the end, keeping the rest in order', () => {
    expect(ids(normalizeLayers([l(PLANET_V), l(NET), l(WDPA)]))).toEqual([NET, WDPA, PLANET_V]);
  });
});

describe('reorderSubset', () => {
  it('reorders legend rows and keeps other layers in their slot', () => {
    const layers = [l(NET), l('custom-area'), l(EXTENT), l(PLANET_V)];
    expect(ids(reorderSubset(layers, [EXTENT, NET, PLANET_V]))).toEqual([
      EXTENT,
      'custom-area',
      NET,
      PLANET_V,
    ]);
  });

  it('keeps background last even if dragged up', () => {
    const layers = [l(NET), l(EXTENT), l(PLANET_V)];
    expect(ids(reorderSubset(layers, [PLANET_V, NET, EXTENT]))).toEqual([NET, EXTENT, PLANET_V]);
  });
});
