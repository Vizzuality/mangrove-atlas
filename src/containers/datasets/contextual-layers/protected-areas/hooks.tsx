import type { SourceProps, LayerProps } from 'react-map-gl';

import type { Visibility } from 'mapbox-gl';

export function useSource(): SourceProps {
  return {
    id: 'protection',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.325yq2xj',
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
  return [
    {
      id,
      type: 'fill',
      source: 'composite',
      'source-layer': 'wdpaclientjuly2022',
      layout: {
        visibility,
      },
      paint: {
        'fill-color': '#286ce2',
        'fill-outline-color': 'hsla(0, 0%, 0%, 0)',
        'fill-opacity': opacity,
      },
    },
    {
      id: `${id}-border`,
      type: 'line',
      source: 'composite',
      'source-layer': 'wdpaclientjuly2022',
      layout: {
        visibility,
      },
      paint: {
        'line-color': '#286ce2',
        'line-opacity': 0.3,
      },
    },
    {
      id: `${id}-label`,
      type: 'symbol',
      metadata: {
        'mapbox:group': '1f4439315750c8010c95dfe168ea659a',
      },
      source: 'composite',
      'source-layer': 'wdpaclientjuly2022',
      layout: {
        'text-field': ['to-string', ['get', 'NAME']],
        'text-size': 10,
        'text-letter-spacing': 0.1,
        'text-line-height': 1,
        'text-max-width': 5,
        'symbol-placement': 'line',
        visibility,
      },
      paint: {
        'text-color': 'hsl(218, 76%, 61%)',
        'text-halo-color': 'hsla(0, 0%, 1%, 0.45)',
        'text-halo-width': 0.5,
        'text-halo-blur': 0,
        'text-opacity': ['interpolate', ['linear'], ['zoom'], 6, 0, 7, 1],
      },
    },
  ];
}
