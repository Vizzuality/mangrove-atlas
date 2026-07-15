import { useMemo } from 'react';

import type { LayerProps, SourceProps } from 'react-map-gl';

export function useSource(): SourceProps {
  return {
    id: 'countries_12miles_location_v4',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.j84w2y',
  };
}

export function useLayers({ id }: { id: LayerProps['id'] }): LayerProps[] {
  return useMemo(
    () => [
      {
        id: `${id}-line`,
        type: 'line',
        source: 'countries_12miles_location_v4',
        'source-layer': 'countries_12miles_location_v4',
        paint: {
          'line-color': 'hsl(58, 66%, 47%)',
          'line-opacity': 0.7,
        },
      },
      {
        id,
        type: 'fill',
        source: 'countries_12miles_location_v4',
        'source-layer': 'countries_12miles_location_v4',
        paint: {
          'fill-color': 'hsla(58, 78%, 58%, 0.08)',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 0],
        },
      },
    ],
    [id]
  );
}
