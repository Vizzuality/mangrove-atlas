import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { widgetYearAtom } from 'store/widgets';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import type { DataResponse, Data } from './types';

// widget data
export function useMangroveProtectedAreas<T>(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, T>
) {
  const currentYear = useRecoilValue(widgetYearAtom);

  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0];
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(locationType, id);
  const fetchMangroveProtectedAreas = () =>
    API.request({
      method: 'GET',
      url: '/widgets/protected-areas',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        year: currentYear,
        ...params,
      },
      ...queryOptions,
    }).then((response) => response.data);

  const query = useQuery(['protected-areas', params], fetchMangroveProtectedAreas, {
    placeholderData: [],
    //  select: (data) => data,
    ...queryOptions,
  });

  const DATA = {
    location,
  } satisfies Data;

  return useMemo(() => {
    return {
      ...query,
      data: DATA,
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
