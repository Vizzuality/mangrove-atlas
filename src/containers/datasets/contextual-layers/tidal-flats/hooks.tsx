import type { SourceProps, LayerProps } from 'react-map-gl';

import type { Visibility } from 'mapbox-gl';

export function useSource(): SourceProps {
  return {
    id: 'tidal-flats',
    type: 'raster',
    tiles: [
      'https://mangrove_atlas.storage.googleapis.com/staging/tilesets/tidal_flats_1_2/{z}/{x}/{y}.png',
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
    paint: {
      'raster-opacity': opacity,
    },
    layout: {
      visibility,
    },
  };
}
