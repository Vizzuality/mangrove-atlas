import { array, string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const mapSettingsAtom = atom<boolean>({
  key: 'map-settings',
  default: false,
});

export const basemapContextualAtom = atom<string[]>({
  key: 'basemaps-contextual',
  default: [],
  effects: [
    urlSyncEffect({
      refine: array(string()),
      history: 'push',
    }),
  ],
});

export const basemapContextualVisualMonthlyDateAtom = atom<{ value: string; label: string }>({
  key: 'basemaps-contextual-visual-monthly-date',
  default: {
    value: null,
    label: null,
  },
});
