import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

export function useSource(): SourceProps {
  return {
    id: 'country-boundaries',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.3v0yd8n1',
  };
}

export function useLayers({ id }: { id: LayerProps['id'] }): LayerProps[] {
  return useMemo(
    () => [
      {
        id: `${id}-line`,
        type: 'line',
        source: 'country-boundaries',
        'source-layer': 'gadm_eez_location_v3',
        paint: {
          'line-color': 'hsl(58, 66%, 47%)',
          'line-opacity': 0.7,
        },
      },
      {
        id,
        type: 'fill',
        source: 'country-boundaries',
        'source-layer': 'gadm_eez_location_v3',
        paint: {
          'fill-color': 'hsla(58, 78%, 58%, 0.08)',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 0],
        },
      },
    ],
    [id]
  );
}
