import type { SourceProps, LayerProps } from 'react-map-gl';

import { flatten } from 'lodash-es';

export function useSources(years): SourceProps[] {
  return flatten(
    years.reduce((acc, year) => {
      const fill = {
        type: 'vector',
        layerId: `extent_${year}`,
        year,
        minZoom: 0,
        maxZoom: 12,
        order: 'last',
      };
      const line = {
        type: 'vector',
        layerId: `extent_${year}_line`,
        year,
        minZoom: 0,
        maxZoom: 12,
        order: 'last',
      };
      return [...acc, fill, line];
    }, [])
  );
}

export function useLayer(years): LayerProps[] {
  const extentLineStyle = {
    'line-color': '#06C4BD',
    'line-width': ['interpolate', ['exponential', 0.7], ['zoom'], 0, 8, 12, 0],
    'line-blur': ['interpolate', ['linear'], ['zoom'], 0, 20, 12, 0],
  };

  const extentFillStyle = {
    'fill-color': '#06C4BD',
    'fill-opacity': 1,
  };

  return flatten(
    years.reduce((acc, year) => {
      const fill = {
        id: `extent_${year}`,
        type: 'fill',
        source: 'extent',
        'source-layer': `mng_mjr_${year}`,
        paint: extentFillStyle,
      };

      const line = {
        id: `extent_${year}_line`,
        type: 'line',
        source: 'extent',
        'source-layer': `mng_mjr_${year}`,
        paint: extentLineStyle,
      };
      return [...acc, fill, line];
    }, [])
  );
}
