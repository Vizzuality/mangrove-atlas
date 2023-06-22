import { array, string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import { ContextualBasemapsId } from 'types/widget';

export const mapSettingsAtom = atom<boolean>({
  key: 'map-settings',
  default: false,
});

export const basemapContextualAtom = atom<ContextualBasemapsId>({
  key: 'basemaps-contextual',
  default: null,
  effects: [
    urlSyncEffect({
      refine: string(),
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

export const basemapContextualAnalyticMonthlyDateAtom = atom<{ value: string; label: string }>({
  key: 'basemaps-contextual-analytic-monthly-date',
  default: {
    value: null,
    label: null,
  },
});
