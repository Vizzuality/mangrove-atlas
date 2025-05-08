import type { LayerProps, SourceProps } from 'react-map-gl';

import type { Visibility } from 'mapbox-gl';

import { useMosaicsFromSeriesPlanetSatelliteBasemaps } from 'containers/datasets/contextual-layers/basemaps-planet/hooks';

export function useSource({ year }): SourceProps & { key: string } {
  const { data: dates } = useMosaicsFromSeriesPlanetSatelliteBasemaps(
    'be1f8e5e-6a29-4d27-8542-1fdb664fd78e'
  );
  const selectedDate = year || (dates?.length && dates?.[dates?.length - 1]?.value);

  return {
    id: 'planet_medres_visual_monthly',
    key: `planet_medres_visual_monthly-${selectedDate}`,
    type: 'raster',
    tiles: [`/planet/planet_medres_visual_${selectedDate}_mosaic/gmap/{z}/{x}/{y}`],
    minzoom: 0,
    maxzoom: 20,
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
