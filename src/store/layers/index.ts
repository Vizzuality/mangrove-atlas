import { array, object, string, stringLiterals, optional, number } from '@recoiljs/refine';
import type { Visibility } from 'mapbox-gl';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

const LayerSettings = object({
  name: optional(string()),
  source: optional(string()),
  source_layer: optional(string()),
  date: optional(string()),
  location: optional(string()),
  layerIndex: optional(number()),
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
      name?: string;
      source?: string;
      source_layer?: string;
      location?: string;
      layerIndex?: number;
      date?: string;
      [key: string]: string | number;
    };
  }[]
>({
  key: 'layers',
  default: [{ id: 'mangrove_habitat_extent', opacity: '1', visibility: 'visible' }],
});
