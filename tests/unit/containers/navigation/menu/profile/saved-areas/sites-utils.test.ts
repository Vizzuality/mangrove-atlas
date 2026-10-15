import { parseSiteGeometries } from '@/containers/datasets/locations/user-locations';
import {
  groupSitesByLandscape,
  siteGeometryToBBox,
  siteGeometryToFeatureCollection,
  type MRTTSite,
} from '@/containers/navigation/menu/profile/saved-areas/sites/utils';

const site = (id: number, landscape_id: number, landscape_name: string): MRTTSite =>
  ({ id, landscape_id, landscape_name, site_name: `Site ${id}` }) as MRTTSite;

const square = {
  type: 'Polygon' as const,
  coordinates: [
    [
      [0, 0],
      [2, 0],
      [2, 1],
      [0, 1],
      [0, 0],
    ],
  ],
};

describe('groupSitesByLandscape', () => {
  it('groups sites by landscape, preserving first-seen landscape order', () => {
    const groups = groupSitesByLandscape([
      site(1, 10, 'Delta'),
      site(2, 20, 'Bay'),
      site(3, 10, 'Delta'),
    ]);
    expect(groups.map((g) => g.landscape_name)).toEqual(['Delta', 'Bay']);
    expect(groups[0].sites.map((s) => s.id)).toEqual([1, 3]);
    expect(groups[1].sites.map((s) => s.id)).toEqual([2]);
  });

  it('returns an empty list for no sites', () => {
    expect(groupSitesByLandscape([])).toEqual([]);
    expect(groupSitesByLandscape(undefined)).toEqual([]);
  });
});

describe('parseSiteGeometries', () => {
  it('parses the stringified site_area into a geometry keyed by site id', () => {
    const out = parseSiteGeometries([
      { id: 1, site_area: JSON.stringify(square) },
      { id: 2, site_area: null },
    ]);
    expect(out[1]).toEqual(square);
    expect(out).not.toHaveProperty('2');
  });

  it('skips malformed or non-polygon geometries without throwing', () => {
    const out = parseSiteGeometries([
      { id: 1, site_area: '{not json' },
      { id: 2, site_area: JSON.stringify({ type: 'Point', coordinates: [0, 0] }) },
      { id: 3, site_area: JSON.stringify(square) },
    ]);
    expect(Object.keys(out)).toEqual(['3']);
  });
});

describe('siteGeometryToFeatureCollection / siteGeometryToBBox', () => {
  it('wraps the geometry in a single-feature collection', () => {
    const fc = siteGeometryToFeatureCollection(square);
    expect(fc.type).toBe('FeatureCollection');
    expect(fc.features).toHaveLength(1);
    expect(fc.features[0].geometry).toEqual(square);
  });

  it('computes the bounding box of the polygon', () => {
    expect(siteGeometryToBBox(square)).toEqual([0, 0, 2, 1]);
  });
});
