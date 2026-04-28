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

const parseAsLayers = createParser({
  parse: (value: string) => {
    try {
      return JSON.parse(value) as LayerState[];
    } catch {
      return defaultLayers;
    }
  },
  serialize: (value: LayerState[]) => JSON.stringify(value),
});

export function useSyncActiveLayers() {
  return useQueryState('layers', parseAsLayers.withDefault(defaultLayers));
}
