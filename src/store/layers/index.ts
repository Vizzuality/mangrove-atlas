import { createParser, useQueryState } from 'nuqs';

import { Data } from '@/containers/datasets/fisheries/commercial-fisheries-production/types';

import { Visibility } from '@/types/layers';
import { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

type LayerState = {
  id: WidgetSlugType | ContextualBasemapsId | 'custom-area' | 'hi-res-extent';
  opacity: string;
  visibility: Visibility;
  filter?: Data['indicator'] | 'total';
  settings?: {
    name?: string;
    source?: string;
    source_layer?: string;
    location?: string;
    layerIndex?: number;
    date?: string;
    [key: string]: string | number;
  };
};

const defaultLayers: LayerState[] = [
  { id: 'mangrove_habitat_extent', opacity: '1', visibility: 'visible' },
];

export const parseAsLayers = createParser({
  parse: (value: string) => {
    try {
      const parsed: unknown = JSON.parse(value);
      if (!Array.isArray(parsed)) return defaultLayers;
      // Drop malformed entries (consumers call layer.id.startsWith etc.) and
      // duplicate ids (a second addLayer with the same id breaks the map).
      const seen = new Set<string>();
      return parsed.filter((layer): layer is LayerState => {
        if (!layer || typeof layer !== 'object' || typeof layer.id !== 'string') return false;
        if (seen.has(layer.id)) return false;
        seen.add(layer.id);
        return true;
      });
    } catch {
      return defaultLayers;
    }
  },
  serialize: (value: LayerState[]) => JSON.stringify(value),
});

export function useSyncActiveLayers() {
  return useQueryState('layers', parseAsLayers.withDefault(defaultLayers));
}
