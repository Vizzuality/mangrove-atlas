import type { SourceProps, LayerProps } from 'react-map-gl';

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
export function useLayer({ id }: { id: LayerProps['id'] }): LayerProps {
  return {
    id,
    type: 'raster',
  };
}
