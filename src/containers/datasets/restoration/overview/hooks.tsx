import type { SourceProps, LayerProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { numberFormat } from 'lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useLocation } from 'containers/datasets/locations/hooks';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import type { Data, DataResponse } from './types';

// widget data
export function useMangroveRestoration(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, Data & { restorable_area_perc: string }>
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0];
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(locationType, id);

  const fetchMangroveRestoration = () =>
    API.request<DataResponse>({
      method: 'GET',
      url: '/widgets/restoration-potential',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
    }).then((response) => response.data);

  return useQuery(['restoration-potential', params], fetchMangroveRestoration, {
    select: ({ data, metadata }) => ({
      ...metadata,
      ...data,
      restorable_area_perc: numberFormat(data?.restorable_area_perc),
      location,
    }),
    ...queryOptions,
  });
}

export function useSource(): SourceProps {
  return {
    type: 'vector',
    promoteId: 'ID',
    url: 'mapbox://globalmangrovewatch.7rr6p3ir',
  };
}
export function useLayers(): LayerProps[] {
  return [
    {
      id: 'mangrove_restoration',
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
        'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.6],
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
    },
  ];
}
