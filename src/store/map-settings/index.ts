import { object, string, stringLiterals, optional, number, bool } from '@recoiljs/refine';
import type { Visibility } from 'mapbox-gl';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import type { ContextualBasemapsId } from 'types/widget';

const dateSchema = object({
  label: string(),
  value: string(),
});
const LayerSettings = object({
  name: string(),
  source: string(),
  source_layer: string(),
  date: dateSchema,
  layerIndex: number(),
});

const layerSchema = object({
  id: string(),
  opacity: string(),
  visibility: stringLiterals({
    none: 'none' as string,
    visible: 'visible' as Visibility,
  }),
  settings: optional(LayerSettings),
});

export const mapSettingsAtom = atom<boolean>({
  key: 'map-settings-open',
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
