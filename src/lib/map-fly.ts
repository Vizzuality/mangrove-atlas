import type { MapRef } from 'react-map-gl';

import turfBbox from '@turf/bbox';
import type { FitBoundsOptions } from 'mapbox-gl';

import { breakpoints } from '@/styles/styles.config';

let mapRef: MapRef | null = null;

export function registerMapRef(ref: MapRef | null) {
  mapRef = ref;
}

export function getMapBounds(): [[number, number], [number, number]] | null {
  return (mapRef?.getBounds()?.toArray() as [[number, number], [number, number]]) ?? null;
}

export type BBox = [number, number, number, number];

type BboxInput = Parameters<typeof turfBbox>[0];

export function isValidBbox(bbox: unknown): bbox is BBox {
  return (
    Array.isArray(bbox) &&
    bbox.length === 4 &&
    bbox.every((v) => typeof v === 'number' && Number.isFinite(v))
  );
}

/**
 * turf's bbox never returns null — an empty or geometry-less collection gives
 * [Infinity, Infinity, -Infinity, -Infinity], which makes fitBounds throw.
 */
export function getGeojsonBbox(geojson: BboxInput | null | undefined): BBox | null {
  if (!geojson) return null;
  try {
    const bbox = turfBbox(geojson);
    return isValidBbox(bbox) ? bbox : null;
  } catch {
    return null;
  }
}

export function flyMapTo(bbox: BBox, options?: FitBoundsOptions) {
  if (!mapRef || !isValidBbox(bbox)) return;

  const screenWidth = window.innerWidth;
  const defaultOptions: FitBoundsOptions = {
    padding: {
      top: 50,
      right: 20,
      bottom: 50,
      left: screenWidth >= breakpoints.lg ? 620 + 20 : 20,
    },
  };

  mapRef.fitBounds(
    [
      [bbox[0], bbox[1]],
      [bbox[2], bbox[3]],
    ],
    options ?? defaultOptions
  );
}
