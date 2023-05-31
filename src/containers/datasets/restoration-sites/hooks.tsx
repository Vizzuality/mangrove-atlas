import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useLocation } from 'containers/datasets/locations/hooks';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

// widget data
export function useMangroveRestorationSites(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0];
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(locationType, id);
  const fetchMangroveRestorationSites = () =>
    API.request({
      method: 'GET',
      url: '/widgets/sites',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
    }).then((response) => response);

  return useQuery(['restoration-sites', params, currentLocation], fetchMangroveRestorationSites, {
    select: ({ data }) => ({
      ...data,
      location,
    }),
    ...queryOptions,
  });
}

export function useMangroveRestorationSitesFilters(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0];
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(locationType, id);
  const fetchMangroveRestorationSitesFilters = () =>
    API.request({
      method: 'GET',
      url: '/widgets/sites_filters',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
    }).then((response) => response);

  return useQuery(
    ['restoration-sites', params, currentLocation],
    fetchMangroveRestorationSitesFilters,
    {
      select: ({ data }) => ({
        ...data,
        location,
      }),
      ...queryOptions,
    }
  );
}

// const _restorationSites = [
//   {
//     site_centroid: {
//       type: 'Polygon',
//       coordinates: [
//         [
//           [100.0, 0.0],
//           [101.0, 0.0],
//           [101.0, 1.0],
//           [100.0, 1.0],
//           [100.0, 0.0],
//         ],
//       ],
//     },
//     landscape_name: 'site 1',
//     organizations: 'site 1',
//     site_name: 'site 1',
//   },
//   {
//     site_centroid: { type: 'Point', coordinates: [102.0, 0.5] },
//     landscape_name: 'site 2',
//     organizations: 'site 2',
//     site_name: 'site 2',
//   },
// ];
export function useSource(): SourceProps {
  return {
    id: 'restoration-sites',
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [102.0, 0.5] },
          properties: { prop0: 'value0' },
        },
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [102.0, 0.0],
              [103.0, 1.0],
              [104.0, 0.0],
              [105.0, 1.0],
            ],
          },
          properties: {
            prop0: 'value0',
            prop1: 0.0,
          },
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [100.0, 0.0],
                [101.0, 0.0],
                [101.0, 1.0],
                [100.0, 1.0],
                [100.0, 0.0],
              ],
            ],
          },
          properties: {
            prop0: 'value0',
            prop1: { this: 'that' },
          },
        },
      ],
    },
    cluster: true,
  };
}
export function useLayer(): LayerProps[] {
  return [
    {
      id: 'restoration-sites-cluster-count',
      type: 'symbol',
      source: 'restoration-sites',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 16,
      },
      paint: {
        'text-color': '#fff',
      },
    },
    {
      id: 'restoration-sites-clusters',
      type: 'circle',
      source: 'restoration-sites',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#00AFA7',
        'circle-stroke-width': 1,
        'circle-stroke-color': '#00857F',
        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 500, 40],
      },
    },

    {
      id: 'restoration-sites',
      type: 'circle',
      source: 'restoration-sites',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#00AFA7',
        'circle-radius': 5,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#00857F',
      },
    },
  ];
}
