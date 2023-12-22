import { array, object, string, number } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

const layerSchema = object({
  id: string(),
  opacity: string(),
});

export const activeLayersAtom = atom<
  { id: WidgetSlugType | ContextualBasemapsId | 'custom-area'; opacity: string }[]
>({
  key: 'layers',
  default: [{ id: 'mangrove_habitat_extent', opacity: '1' }],
  effects: [
    urlSyncEffect({
      refine: array(layerSchema),
      history: 'replace',
    }),
  ],
});
