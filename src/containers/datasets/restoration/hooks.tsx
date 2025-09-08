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
export function useLayer({
  id,
  opacity,
  visibility = 'visible',
}: {
  id: LayerProps['id'];
  opacity?: number;
  visibility?: Visibility;
}): LayerProps {
  return useMemo(
    () =>
      ({
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
            [
              'any',
              ['boolean', ['feature-state', 'hover'], false],
              ['boolean', ['feature-state', 'clicked'], false],
            ],
            1,
            opacity * 0.6,
          ],
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
        layout: {
          visibility,
        },
      }) satisfies LayerProps,
    [id, opacity, visibility]
  );
}
