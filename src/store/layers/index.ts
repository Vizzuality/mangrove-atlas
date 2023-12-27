import { array, object, string, stringLiterals } from '@recoiljs/refine';
import type { Visibility } from 'mapbox-gl';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

const layerSchema = object({
  id: string(),
  opacity: string(),
  visibility: stringLiterals({
    none: 'none' as string,
    visible: 'visible' as Visibility,
  }),
});

export const activeLayersAtom = atom<
  {
    id: WidgetSlugType | ContextualBasemapsId | 'custom-area';
    opacity: string;
    visibility: Visibility;
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
