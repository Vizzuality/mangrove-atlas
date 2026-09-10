import type { SourceProps, LayerProps } from 'react-map-gl';

import { Visibility } from '@/types/layers';

export function useSource(): SourceProps {
  return {
    id: 'allen-coral-reef',
    type: 'raster',
    tiles: [
      'https://mangrove_atlas.storage.googleapis.com/staging/tilesets/allen_coral_atlas_v2/{z}/{x}/{y}.png',
    ],
    minzoom: 0,
    // The bucket has no z0–1 tiles (the low zooms were never generated), so a
    // freshly mounted map fitting the whole world — the report's small layer
    // cards — requested them, got 404s and drew nothing. Declaring the 256px
    // tiles as 128 makes mapbox pick tiles two zoom levels deeper, so the
    // world view draws from z2, the first level the bucket actually has.
    tileSize: 128,
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
    source: 'allen-coral-reef',
    paint: {
      'raster-opacity': opacity,
    },
    layout: {
      visibility,
    },
  };
}
