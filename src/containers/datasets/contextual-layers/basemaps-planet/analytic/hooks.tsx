import type { SourceProps, LayerProps } from 'react-map-gl';

import type { Visibility } from 'mapbox-gl';

import { useMosaicsFromSeriesPlanetSatelliteBasemaps } from 'containers/datasets/contextual-layers/basemaps-planet/hooks';

export function useSource({ date }): SourceProps & { key: string } {
  const { data: dates } = useMosaicsFromSeriesPlanetSatelliteBasemaps(
    '45d01564-c099-42d8-b8f2-a0851accf3e7'
  );
  const selectedDate = date || (dates?.length && dates?.[dates?.length - 1]?.value);

  return {
    id: 'planet_medres_analytic_monthly',
    key: `planet_medres_analytic_monthly-${selectedDate}`,
    type: 'raster',
    tiles: [`/planet/planet_medres_normalized_analytic_${selectedDate}_mosaic/gmap/{z}/{x}/{y}`],
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
