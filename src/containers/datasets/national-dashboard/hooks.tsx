import type { VectorSource, LayerProps } from 'react-map-gl';

import flatten from 'lodash-es/flatten';

import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import type { Data, DataResponse } from './types';
// widget data

export function useNationalDashboard(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, Data>
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { id: currentLocation, location_id },
  } = useLocation(locationType, id);

  const fetchMangroveNationalDashboard = () =>
    API.request({
      method: 'GET',
      url: '/widgets/national_dashboard',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
    }).then((response) => response.data);

  return useQuery(['national_dashboard', params, location_id], fetchMangroveNationalDashboard, {
    select: (data) => data,
    ...queryOptions,
  });
}

export function useSource(): VectorSource {
  const { data } = useNationalDashboard();

  const sources = flatten(
    data?.data?.map(({ sources }) =>
      flatten(
        sources.map(({ data_source }) =>
          data_source.map(({ layer_link }, index) =>
            index === 0 ? `mapbox://${layer_link}` : layer_link
          )
        )
      )
    )
  )[0];

  return {
    id: 'national-dashboard-source',
    type: 'vector',
    url: sources,
  };
}

export function useLayers({ id }: { id: LayerProps['id'] }): LayerProps[] {
  return [
    {
      id,
      source: 'protected-areas',
      'source-layer': 'MangroveExtent2020TanzaniaFinalQAv2',
      type: 'fill',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          '#cf597e',
          0.2,
          '#eeb479',
          0.4,
          '#e9e29c',
          0.6,
          '#9ccb86',
          0.8,
          '#009392',
        ],
        'fill-outline-color': [
          'step',
          ['linear'],
          '#cf597e',
          0.2,
          '#eeb479',
          0.4,
          '#e9e29c',
          0.6,
          '#9ccb86',
          0.8,
          '#009392',
        ],
        'fill-opacity': 0.7,
      },
    },
  ];
}
