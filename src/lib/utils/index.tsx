import type { Visibility } from 'mapbox-gl';

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

export const normalize = (s: string) =>
  s
    .normalize('NFKD') // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
    .replace(/[\u0300-\u036f]/g, '') //  Remove accents/diacritics in a string
    .trim()
    .toLowerCase();

export function sortObject(obj: Record<string, string[]>) {
  const compare = (a: string, b: string) => {
    const A = normalize(a);
    const B = normalize(b);
    if (A < B) return -1;
    if (A > B) return 1;
    return 0;
  };

  const sortedEntries = Object.entries(obj)
    .sort(([keyA], [keyB]) => compare(keyA, keyB)) // sort keys
    .map(([key, arr]) => [key, [...arr].sort(compare)]); // sort array values

  return Object.fromEntries(sortedEntries);
}
