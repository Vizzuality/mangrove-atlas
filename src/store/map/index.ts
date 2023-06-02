import { string, number, array } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const basemapAtom = atom({
  key: 'basemap',
  default: 'light',
  effects: [
    urlSyncEffect({
      refine: string(),
    }),
  ],
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

export const restorationPopUpAtom = atom<{
  popup: number[];
  popupInfo: Record<string, string | number>;
  popUpPosition: { x: number; y: number };
}>({
  key: 'restoration-popup',
  default: {
    popup: [],
    popupInfo: {},
    popUpPosition: {
      x: null,
      y: null,
    },
  },
});
