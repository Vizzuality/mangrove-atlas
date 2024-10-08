import type { LayerProps as RMGLLayerProps } from 'react-map-gl';

import type { Visibility } from 'mapbox-gl';

import type { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

export type LayerProps = {
  id?: string;
  beforeId?: string;
  onAdd?: (ids: RMGLLayerProps['id'][]) => void;
  onRemove?: (ids: RMGLLayerProps['id'][]) => void;
  zIndex?: number;
};

export type ActiveLayers = {
  id: WidgetSlugType | ContextualBasemapsId | 'custom-area' | 'hi-res-extent';
  opacity: string;
  visibility: Visibility;
};
