import type { SourceProps, LayerProps } from 'react-map-gl';

import { Visibility } from '@/types/layers';

export function useSource(): SourceProps {
  return {
    id: 'salt-marsh',
    type: 'raster',
    tiles: [
      'https://storage.googleapis.com/mangrove_atlas/staging/tilesets/global_tidal_marshes/{z}/{x}/{y}.png',
    ],
    minzoom: 0,
    maxzoom: 12,
  };
}
export function useLayer({
  id,
  opacity,
  visibility = 'visible',
}: {
  id: LayerProps['id'];
  opacity?: number;
  visibility?: Visibility;
}): LayerProps {
  return {
    id,
    type: 'raster',
    source: 'salt-marsh',
    paint: {
      'raster-opacity': opacity,
    },
    layout: {
      visibility,
    },
  };
}
