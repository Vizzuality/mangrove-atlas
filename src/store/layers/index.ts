import { array, object, string, stringLiterals, optional, number } from '@recoiljs/refine';
import type { Visibility } from 'mapbox-gl';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

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

export const activeLayersAtom = atom<
  {
    id: WidgetSlugType | ContextualBasemapsId | 'custom-area';
    opacity: string;
    visibility: Visibility;
    settings?: {
      name: string;
      source: string;
      source_layer: string;
      layerIndex: number;
      date: { label: string; value: string };
      [key: string]: string | number | { label: string; value: string };
    };
  }[]
>({
  key: 'layers',
  default: [{ id: 'mangrove_habitat_extent', opacity: '1', visibility: 'visible' }],
  effects: [
    urlSyncEffect({
      refine: array(layerSchema),
      history: 'replace',
    }),
  ],
});
