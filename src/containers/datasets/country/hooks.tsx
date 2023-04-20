import type { SourceProps, LayerProps } from 'react-map-gl';

export function useSource(): SourceProps {
  return {
    id: 'country-boundaries',
    type: 'vector',
    url: 'mapbox://mangrove-atlas.8hyyoyq7',
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
        'line-color': 'hsl(58, 66%, 47%)',
      },
    },
    {
      id: 'selected-eez-land-v2-201410',
      type: 'fill',
      source: 'country-boundaries',
      'source-layer': 'gadm_eez_location_v3',
      paint: {
        'fill-color': 'hsla(58, 78%, 58%, 0.2)',
        'fill-opacity': ['interpolate', ['linear'], ['zoom'], 0, 1, 8, 0],
      },
    },
  ];
}
