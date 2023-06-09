import type { LayerProps as RMGLLayerProps } from 'react-map-gl';

export type LayerProps = {
  id?: string;
  beforeId?: string;
  onAdd?: (ids: RMGLLayerProps['id'][]) => void;
  onRemove?: (ids: RMGLLayerProps['id'][]) => void;
  zIndex?: number;
};
