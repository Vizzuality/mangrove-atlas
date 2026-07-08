import {
  countTiles,
  expandTemplate,
  latToTileY,
  lngToTileX,
  tilesForBBox,
  type BBox,
} from '@/lib/offline/tiles';

const WORLD: BBox = [-180, -85, 180, 85];

describe('lngToTileX / latToTileY', () => {
  it('maps the top-left of the world to tile 0,0', () => {
    expect(lngToTileX(-180, 0)).toBe(0);
    expect(latToTileY(85, 0)).toBe(0);
  });

  it('splits the world into a 2×2 grid at z1', () => {
    expect(lngToTileX(-180, 1)).toBe(0);
    expect(lngToTileX(179.9, 1)).toBe(1);
    expect(latToTileY(85, 1)).toBe(0);
    expect(latToTileY(-85, 1)).toBe(1);
  });

  it('clamps latitude to the Web Mercator limit instead of returning NaN', () => {
    // Beyond ±85.05° the mercator projection diverges; the fn clamps first.
    expect(Number.isFinite(latToTileY(90, 3))).toBe(true);
    expect(Number.isFinite(latToTileY(-90, 3))).toBe(true);
  });
});

describe('countTiles', () => {
  it('counts a single tile for the whole world at z0', () => {
    expect(countTiles(WORLD, 0, 0)).toBe(1);
  });

  it('sums the pyramid across an inclusive zoom range (z0..1 = 1 + 4)', () => {
    expect(countTiles(WORLD, 0, 1)).toBe(5);
  });

  it('counts one tile for a tiny bbox wholly inside a single tile', () => {
    const point: BBox = [10, 10, 10.001, 10.001];
    expect(countTiles(point, 5, 5)).toBe(1);
  });
});

describe('tilesForBBox', () => {
  it('enumerates every tile of the world pyramid z0..1', () => {
    const tiles = tilesForBBox(WORLD, 0, 1);
    expect(tiles).toHaveLength(5);
    expect(tiles).toContainEqual({ z: 0, x: 0, y: 0 });
  });

  it('stops at the cap so a careless zoom range cannot explode', () => {
    const tiles = tilesForBBox(WORLD, 0, 12, 10);
    expect(tiles).toHaveLength(10);
  });

  it('matches countTiles when under the cap', () => {
    const bbox: BBox = [-10, -10, 10, 10];
    expect(tilesForBBox(bbox, 3, 6).length).toBe(countTiles(bbox, 3, 6));
  });
});

describe('expandTemplate', () => {
  it('substitutes z/x/y into a slippy template', () => {
    expect(expandTemplate('https://host/{z}/{x}/{y}.png', { z: 3, x: 4, y: 5 })).toBe(
      'https://host/3/4/5.png'
    );
  });

  it('resolves the TMS {-y} axis flip (2^z - 1 - y)', () => {
    expect(expandTemplate('https://host/{z}/{x}/{-y}.png', { z: 2, x: 1, y: 0 })).toBe(
      'https://host/2/1/3.png'
    );
  });

  it('strips optional {ratio} and {quadkey} placeholders', () => {
    expect(
      expandTemplate('https://host/{z}/{x}/{y}{ratio}.png?q={quadkey}', { z: 1, x: 0, y: 0 })
    ).toBe('https://host/1/0/0.png?q=');
  });
});
