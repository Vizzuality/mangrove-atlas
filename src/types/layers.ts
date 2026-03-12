import type { LayerProps as RMGLLayerProps } from 'react-map-gl';

import type { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

export type Visibility = 'visible' | 'none';

export type LayerProps = {
  id?: string;
  beforeId?: string;
  onAdd?: (ids: RMGLLayerProps['id'][]) => void;
  onRemove?: (ids: RMGLLayerProps['id'][]) => void;
  zIndex?: number;
};

export type Layer = {
  id:
    | WidgetSlugType
    | ContextualBasemapsId
    | 'custom-area'
    | 'hi-res-extent'
    | `mangrove_national_dashboard_layer_${string}`;
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
};
