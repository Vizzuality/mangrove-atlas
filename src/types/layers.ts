import type { LayerProps as RMGLLayerProps } from 'react-map-gl';

import type { Visibility } from 'mapbox-gl';

import { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

export type LayerProps = {
  id?: string;
  beforeId?: string;
  onAdd?: (ids: RMGLLayerProps['id'][]) => void;
  onRemove?: (ids: RMGLLayerProps['id'][]) => void;
  zIndex?: number;
};

export type ActiveLayers = {
  id: WidgetSlugType | ContextualBasemapsId | 'custom-area';
  opacity: string;
  visibility: Visibility;
};
