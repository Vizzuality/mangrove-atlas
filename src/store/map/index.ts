import type { LayerProps } from 'react-map-gl';

import { atom } from 'jotai';
import type { LngLat } from 'mapbox-gl';
import { createParser, parseAsStringLiteral, useQueryState } from 'nuqs';

// Keep in sync with BasemapId in containers/datasets/contextual-layers/basemaps.
// An unknown value would make mapbox fall back to its default style, which
// lacks the `water` / `custom-layers` anchors every layer is inserted before.
const BASEMAP_IDS = ['light', 'dark', 'satellite'] as const;

export function useSyncBasemap() {
  return useQueryState('basemap', parseAsStringLiteral(BASEMAP_IDS).withDefault('light'));
}

const isLngLat = (p: unknown): p is [number, number] =>
  Array.isArray(p) &&
  p.length === 2 &&
  typeof p[0] === 'number' &&
  typeof p[1] === 'number' &&
  Number.isFinite(p[0]) &&
  Number.isFinite(p[1]) &&
  Math.abs(p[1]) <= 90;

// Only accept [[lng, lat], [lng, lat]]. Anything else (truncated share links,
// hand-edited URLs) would make mapbox throw "Invalid LngLat" on map init.
export const parseAsBounds = createParser({
  parse: (value: string) => {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.length === 2 && parsed.every(isLngLat)) {
        return parsed as number[][];
      }
      return null;
    } catch {
      return null;
    }
  },
  serialize: (value: number[][]) => JSON.stringify(value),
});

// ? this hook syncs the bounds of the URL with the initial view of the map, allowing
// ? the initialization of the map with bounds from the URL
export function useSyncURLBounds() {
  return useQueryState('bounds', parseAsBounds.withDefault(null));
}

// ? this atom sets internally the bounds of the map, not messing with the ones from the URL
export const locationBoundsAtom = atom(null as [number, number, number, number] | null);

// One-shot reactive camera target. External nav handlers (location list, map popup,
// saved areas, custom-draw) write to this; the map consumes it, flies, and clears on
// the next settled move. Keeps navigation URLs free of bounds — the URL bounds param
// is a separate shareable-state concern, synced by the map's own onMove handler.
type TmpCamera = { bbox: [number, number, number, number] } | { worldwide: true };
export const tmpCameraAtom = atom(null as TmpCamera | null);

export const interactiveLayerIdsAtom = atom<LayerProps['id'][]>([]);

export const mapCursorAtom = atom<'grab' | 'pointer' | 'cell'>('grab');

export const coordinatesAtom = atom(null as LngLat | null);

export const mapDraggableTooltipPositionAtom = atom(null as { x: number; y: number } | null);

export const mapDraggableTooltipPinnedAtom = atom<boolean>(false);

export const mapDraggableTooltipDimensionsAtom = atom(null as { h: number; w: number } | null);
