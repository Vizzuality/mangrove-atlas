import { Visibility } from 'mapbox-gl';

import type { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

export function orderByAttribute(
  layerIds: (WidgetSlugType | ContextualBasemapsId | 'custom-area')[],
  layers: { id: string; opacity: string; visibility: Visibility }[]
) {
  const index = layerIds.reduce((map, id, index) => {
    map[id] = index;
    return map;
  }, {});

  const copyOfLayers = [...layers];

  return copyOfLayers.sort((a, b) => {
    const indexA = (index[a.id] ?? Number.MAX_VALUE) as number;
    const indexB = (index[b.id] ?? Number.MAX_VALUE) as number;

    return indexA - indexB;
  });
}
