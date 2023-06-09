import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

export function useSource(): SourceProps {
  return {
    type: 'vector',
    promoteId: 'ID',
    url: 'mapbox://globalmangrovewatch.7rr6p3ir',
  };
}
export function useLayers({ id }: { id: LayerProps['id'] }): LayerProps[] {
  return useMemo(
    () =>
      [
        {
          id,
          type: 'fill',
          source: 'mangrove_restoration',
          'source-layer': 'MOW_Global_Mangrove_Restoration_202212',
          paint: {
            'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'Rest_Score'],
              20,
              '#f9ddda',
              40,
              '#ffadad',
              60,
              '#ce78b3',
              80,
              '#8478ce',
              100,
              '#224294',
            ],
            'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.6],
            'fill-outline-color': [
              'interpolate',
              ['linear'],
              ['get', 'Rest_Score'],
              20,
              '#f9ddda',
              40,
              '#ffadad',
              60,
              '#ce78b3',
              80,
              '#8478ce',
              100,
              '#224294',
            ],
          },
        },
      ] satisfies LayerProps[],
    [id]
  );
}
