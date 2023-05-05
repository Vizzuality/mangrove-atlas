import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

// widget data
export function useMangroveProtectedAreas(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions = {}
) {
  const fetchMangroveProtectedAreas = () =>
    API.request({
      method: 'GET',
      url: '/widgets/protected-areas',
      params,
    }).then((response) => response.data);

  const query = useQuery(['protected-areas', params], fetchMangroveProtectedAreas, {
    placeholderData: [],
    //  select: (data) => data,
    ...queryOptions,
  });

  return useMemo(() => {
    return {
      ...query,
    } as typeof query;
  }, [query]);
}

export function useSource(): SourceProps {
  return {
    id: 'protection-source',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.0i6otzu4',
  };
}

export function useLayers(): LayerProps[] {
  return [
    {
      id: 'protection-layer',
      source: 'protected-areas',
      'source-layer': 'protected_area_pct',
      type: 'fill',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'pct_protected'],
          0,
          '#CF597E',
          0.4,
          '#EEB479',
          0.6,
          '#E9E29C',
          0.8,
          '#9CCB86',
          1,
          '#009392',
        ],
        'fill-outline-color': [
          'interpolate',
          ['linear'],
          ['get', 'pct_protected'],
          0,
          '#CF597E',
          0.4,
          '#EEB479',
          0.6,
          '#E9E29C',
          0.8,
          '#9CCB86',
          1,
          '#009392',
        ],
        'fill-opacity': 0.5,
      },
    },
  ];
}

//   {
//     id: 'selected-wdpa-polygons',
//     type: 'fill',
//     source: 'composite',
//     'source-layer': 'wdpaclientjuly2022',
//     layout: {},
//     paint: {
//       'fill-color': '#286ce2',
//       'fill-outline-color': 'hsla(0, 0%, 0%, 0)',
//       'fill-opacity': 0.1,
//     },
//   },
//   {
//     id: 'selected-wdpa-polygons-border',
//     type: 'line',
//     source: 'composite',
//     'source-layer': 'wdpaclientjuly2022',
//     layout: {},
//     paint: {
//       'line-color': '#286ce2',
//       'line-opacity': 0.3,
//     },
//   },
//   {
//     id: 'selected-wdpa-polygons-label',
//     type: 'symbol',
//     metadata: {
//       'mapbox:group': '1f4439315750c8010c95dfe168ea659a',
//     },
//     source: 'composite',
//     'source-layer': 'wdpaclientjuly2022',
//     layout: {
//       'text-field': ['to-string', ['get', 'NAME']],
//       'text-size': 10,
//       'text-letter-spacing': 0.1,
//       'text-line-height': 1,
//       'text-max-width': 5,
//       'symbol-placement': 'line',
//     },
//     paint: {
//       'text-color': 'hsl(218, 76%, 61%)',
//       'text-halo-color': 'hsla(0, 0%, 1%, 0.45)',
//       'text-halo-width': 0.5,
//       'text-halo-blur': 0,
//       'text-opacity': ['interpolate', ['linear'], ['zoom'], 6, 0, 7, 1],
//     },
//   },
