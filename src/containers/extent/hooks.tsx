import type { SourceProps, LayerProps } from 'react-map-gl';

export function useSource(): SourceProps {
  return {
    id: 'habitat_extent',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.20cshxs9,globalmangrovewatch.b1wlg2x7,globalmangrovewatch.2cws6y26,globalmangrovewatch.bgrhiwte,globalmangrovewatch.aokkuxu7,globalmangrovewatch.0l7s8iga,globalmangrovewatch.a08vpx09,globalmangrovewatch.7kyxxf0e,globalmangrovewatch.1cu4rmy9,globalmangrovewatch.6st408jz,globalmangrovewatch.1clkx4nk',
  };
}

export function useLayers(year: number): LayerProps[] {
  return [
    {
      id: `habitat_extent_${year}`,
      type: 'fill',
      source: 'habitat_extent',
      'source-layer': `mng_mjr_${year}`,
      paint: {
        'fill-color': '#06C4BD',
        'fill-opacity': 1,
      },
    },
    {
      id: `habitat_extent_${year}_line`,
      type: 'line',
      source: 'habitat_extent',
      'source-layer': `mng_mjr_${year}`,
      paint: {
        'line-color': '#06C4BD',
        'line-width': ['interpolate', ['exponential', 0.7], ['zoom'], 0, 8, 12, 0],
        'line-blur': ['interpolate', ['linear'], ['zoom'], 0, 20, 12, 0],
      },
    },
  ];
}
