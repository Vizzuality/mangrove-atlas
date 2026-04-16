import type { LayerProps } from 'react-map-gl';

import { atom } from 'jotai';
import type { LngLat } from 'mapbox-gl';
import { createParser, parseAsString, useQueryState } from 'nuqs';

export function useSyncBasemap() {
  return useQueryState('basemap', parseAsString.withDefault('light'));
}

const parseAsBounds = createParser({
  parse: (value: string) => {
    try {
      return JSON.parse(value) as number[][];
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

export const interactiveLayerIdsAtom = atom<LayerProps['id'][]>([]);

export const mapCursorAtom = atom<'grab' | 'pointer' | 'cell'>('grab');

export const coordinatesAtom = atom(null as LngLat | null);

export const mapDraggableTooltipPositionAtom = atom(null as { x: number; y: number } | null);

export const mapDraggableTooltipPinnedAtom = atom<boolean>(false);

export const mapDraggableTooltipDimensionsAtom = atom(null as { h: number; w: number } | null);
