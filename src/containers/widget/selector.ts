import { activeLayersAtom } from 'store/layers';

import { selectorFamily } from 'recoil';

import type { WidgetSlugType, ContextualBasemapsId } from 'types/widget';

export const getLayerActive = selectorFamily<
  boolean,
  WidgetSlugType | ContextualBasemapsId | 'custom-area'
>({
  key: 'is-layer-active',
  get:
    (widgetId) =>
    ({ get }) => {
      const activeLayers = get(activeLayersAtom);
      // Check if any object in the array has an id that matches widgetId
      return activeLayers.some((layer) => layer.id === widgetId);
    },
});
