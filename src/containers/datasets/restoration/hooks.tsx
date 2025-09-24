import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import type { Visibility } from 'mapbox-gl';

export function useSource(): SourceProps {
  return {
    type: 'vector',
    promoteId: 'ID',
    url: 'mapbox://globalmangrovewatch.7rr6p3ir',
    id: 'mangrove_restoration',
  };
}
export function useLayers({
  id,
  opacity,
  visibility = 'visible',
}: {
  id: LayerProps['id'];
  opacity?: number;
  visibility?: Visibility;
}): LayerProps[] {
  return useMemo(
    () =>
      [
        {
          id: `${id}-layer`,
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
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              1,
              opacity * 0.6,
            ],
          },
          layout: { visibility },
        },
        {
          id: `${id}-layer-line`,
          type: 'line',
          source: 'mangrove_restoration',
          'source-layer': 'MOW_Global_Mangrove_Restoration_202212',
          paint: {
            'line-color': [
              'interpolate',
              ['linear'],
              ['get', 'Rest_Score'],
              20,
              '#f2b7b0',
              40,
              '#e68787',
              60,
              '#b05d98',
              80,
              '#6b61b1',
              100,
              '#1b3374',
            ],
            'line-width': ['case', ['boolean', ['feature-state', 'clicked'], false], 1.25, 0.25],
          },
          layout: { visibility },
        },
      ] satisfies LayerProps[],
    [id, opacity, visibility]
  );
}
