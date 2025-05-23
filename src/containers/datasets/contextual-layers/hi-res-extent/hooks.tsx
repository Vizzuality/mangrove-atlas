import { useMemo } from 'react';

import type { LayerProps, SourceProps } from 'react-map-gl';

export function useSource(): SourceProps {
  return {
    id: 'hi-res-extent',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.gmw_v4019_sen2_mng_all_zooms',
  };
}
const darkTeal = '#005f73';
export function useLayers({ id }: { id: LayerProps['id'] }): LayerProps[] {
  return useMemo(
    () => [
      {
        id: `${id}_fill`,
        type: 'fill',
        source: 'hi-res-extent',
        'source-layer': 'gmw_v4019_sen2_mng',
        paint: {
          'fill-color': darkTeal,
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 0, 0.5, 12, 0.3],
        },
        layout: {
          visibility: 'visible',
        },
      },
      {
        id: `${id}_line`,
        type: 'line',
        source: 'hi-res-extent',
        'source-layer': 'gmw_v4019_sen2_mng',
        paint: {
          'line-color': darkTeal,
          'line-opacity': 0.8,
          'line-width': ['interpolate', ['linear'], ['zoom'], 0, 6, 12, 2],
          'line-blur': ['interpolate', ['linear'], ['zoom'], 0, 10, 12, 0],
        },
        layout: {
          visibility: 'visible',
        },
      },
    ],
    [id]
  );
}
