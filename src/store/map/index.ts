import type { LayerProps } from 'react-map-gl';

import { string, number, array } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import type { BasemapId } from 'containers/datasets/contextual-layers/basemaps';

export const basemapAtom = atom<BasemapId>({
  key: 'basemap',
  default: 'light',
});

// ? this atom syncs the bounds of the URL with the initial view of the map, allowing
// ? the initialization of the map with bounds from the URL
export const URLboundsAtom = atom({
  key: 'bounds',
  default: null,
  effects: [
    urlSyncEffect({
      refine: array(array(number())),
    }),
  ],
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
