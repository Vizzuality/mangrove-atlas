import { string, object, number } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import { DEFAULT_VIEW_STATE } from 'components/map/constants';

const { zoom, latitude, longitude } = DEFAULT_VIEW_STATE;

export const basemapAtom = atom({
  key: 'basemap',
  default: 'light',
  effects: [
    urlSyncEffect({
      refine: string(),
    }),
  ],
});

export const mapAtom = atom({
  key: 'map',
  default: {
    zoom,
    latitude,
    longitude,
  },
  effects: [
    urlSyncEffect({
      refine: object({
        zoom: number(),
        latitude: number(),
        longitude: number(),
      }),
    }),
  ],
});
