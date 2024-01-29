import type { LayerProps } from 'react-map-gl';

import { atom } from 'recoil';

import type { BasemapId } from 'containers/datasets/contextual-layers/basemaps';

export const basemapAtom = atom<BasemapId>({
  key: 'basemap',
  default: 'light',
});

// ? this atom syncs the bounds of the URL with the initial view of the map
export const URLboundsAtom = atom({
  key: 'bounds',
  default: null,
});

// ? this atom sets internally the bounds of the map, not messing with the ones from the URL
export const locationBoundsAtom = atom<[number, number, number, number]>({
  key: 'locationBounds',
  default: null,
});

export const interactiveLayerIdsAtom = atom<LayerProps['id'][]>({
  key: 'interactiveIds',
  default: [],
});

export const mapCursorAtom = atom<'grab' | 'pointer' | 'cell'>({
  key: 'mapCursor',
  default: 'grab',
});
