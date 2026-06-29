// Slippy-map tile math + URL templating, shared by the viewport prefetch (B)
// and the deliberate region download (C). Pure functions, no DOM/SW deps.

export type Tile = { z: number; x: number; y: number };
export type BBox = [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]

// Max native zoom our GCS raster tilesets publish (their source `maxzoom: 12`).
// Mapbox GL overzooms — scales cached z12 tiles — for any zoom beyond this, so
// caching the z0..12 pyramid for an area makes EVERY zoom level render offline.
export const OVERZOOM_MAX = 12;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Longitude → tile X at zoom z. */
export function lngToTileX(lng: number, z: number): number {
  return Math.floor(((lng + 180) / 360) * 2 ** z);
}

/** Latitude → tile Y at zoom z (Web Mercator). */
export function latToTileY(lat: number, z: number): number {
  const rad = (clamp(lat, -85.05112878, 85.05112878) * Math.PI) / 180;
  return Math.floor(((1 - Math.asinh(Math.tan(rad)) / Math.PI) / 2) * 2 ** z);
}

/** Number of tiles a bbox covers across the inclusive zoom range — for size estimates. */
export function countTiles(bbox: BBox, minZoom: number, maxZoom: number): number {
  let total = 0;
  for (let z = minZoom; z <= maxZoom; z++) {
    const [minLng, minLat, maxLng, maxLat] = bbox;
    const max = 2 ** z - 1;
    const x0 = clamp(lngToTileX(minLng, z), 0, max);
    const x1 = clamp(lngToTileX(maxLng, z), 0, max);
    const y0 = clamp(latToTileY(maxLat, z), 0, max); // maxLat → smaller Y
    const y1 = clamp(latToTileY(minLat, z), 0, max);
    total += (Math.abs(x1 - x0) + 1) * (Math.abs(y1 - y0) + 1);
  }
  return total;
}

/**
 * Enumerate every tile covering `bbox` across [minZoom, maxZoom]. Bounded by
 * `cap` (returns early once reached) so a careless zoom range can't generate
 * millions of coordinates.
 */
export function tilesForBBox(bbox: BBox, minZoom: number, maxZoom: number, cap = 5000): Tile[] {
  const tiles: Tile[] = [];
  const [minLng, minLat, maxLng, maxLat] = bbox;
  for (let z = minZoom; z <= maxZoom; z++) {
    const max = 2 ** z - 1;
    const x0 = clamp(Math.min(lngToTileX(minLng, z), lngToTileX(maxLng, z)), 0, max);
    const x1 = clamp(Math.max(lngToTileX(minLng, z), lngToTileX(maxLng, z)), 0, max);
    const y0 = clamp(Math.min(latToTileY(minLat, z), latToTileY(maxLat, z)), 0, max);
    const y1 = clamp(Math.max(latToTileY(minLat, z), latToTileY(maxLat, z)), 0, max);
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        if (tiles.length >= cap) return tiles;
        tiles.push({ z, x, y });
      }
    }
  }
  return tiles;
}

/** Expand a `{z}/{x}/{y}` (and `{-y}` TMS) raster URL template for one tile. */
export function expandTemplate(template: string, { z, x, y }: Tile): string {
  return template
    .replace(/\{z\}/g, String(z))
    .replace(/\{x\}/g, String(x))
    .replace(/\{y\}/g, String(y))
    .replace(/\{-y\}/g, String(2 ** z - 1 - y))
    .replace(/\{ratio\}/g, '')
    .replace(/\{quadkey\}/g, '');
}
