import type { SourceProps, LayerProps } from 'react-map-gl';

export function useSource(): SourceProps {
  return {
    id: 'country-boundaries',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.3v0yd8n1',
  };
}

export function useLayers(): LayerProps[] {
  return [
    {
      id: 'selected-eez-land-v2-201410-line',
      type: 'line',
      source: 'country-boundaries',
      'source-layer': 'gadm_eez_location_v3',
      paint: {
        'line-color': 'red',
      },
    },
    {
      id: 'selected-eez-land-v2-201410',
      type: 'fill',
      source: 'country-boundaries',
      'source-layer': 'gadm_eez_location_v3',
      paint: {
        'fill-color': 'red',
        'fill-opacity': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 0],
      },
    },
  ];
}
