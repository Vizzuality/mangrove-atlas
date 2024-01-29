import { atom } from 'recoil';

import type { ContextualBasemapsId } from 'types/widget';

export const mapSettingsAtom = atom<boolean>({
  key: 'map-settings-open',
  default: false,
});

export const basemapContextualAtom = atom<ContextualBasemapsId>({
  key: 'basemaps-contextual',
  default: null,
});

export const basemapContextualVisualMonthlyDateAtom = atom({
  key: 'basemaps-contextual-visual-monthly-date',
  default: false,
});

export const basemapContextualAnalyticMonthlyDateAtom = atom({
  key: 'basemaps-contextual-analytic-monthly-date',
  default: false,
});

export const fullScreenAtom = atom<boolean>({
  key: 'fullScreen',
  default: false,
});
