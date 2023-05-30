import { useMemo } from 'react';

import { useQuery, UseQueryOptions, useQueryClient } from '@tanstack/react-query';
import { data } from 'cypress/types/jquery';

import API from 'services/api';

import type { Location, LocationTypes } from './types';

export type DataResponse = {
  data: Location[];
  metadata: unknown;
};

export const HIGHLIGHTED_PLACES = {
  rufiji: '0edd0ebb-892b-5774-8ce5-08e0ba7136b1',
  saloum: '4a79230b-7ecb-58ae-ba0d-0f57faa2a104',
};

export const fetchLocations = () =>
  API.request<DataResponse>({
    method: 'GET',
    url: '/locations',
  }).then((response) => response.data);

export function useLocations<T = Location[]>(
  queryOptions: UseQueryOptions<DataResponse, Error, T> = {}
) {
  const queryClient = useQueryClient();
  return useQuery(['locations'], fetchLocations, {
    placeholderData: queryClient.getQueryData(['locations']) || {
      data: [],
      metadata: null,
    },
    ...queryOptions,
  });
}

export function useLocation(
  locationType: LocationTypes,
  id: string,
  queryOptions: UseQueryOptions<DataResponse, Error, Location> = {}
) {
  const queryClient = useQueryClient();
  return useQuery(['locations'], fetchLocations, {
    placeholderData: queryClient.getQueryData(['locations']) || {
      data: [],
      metadata: null,
    },
    select: (data) => {
      const result = data?.data?.find((d) => {
        return (
          (d.location_type === locationType && (d.location_id === id || d.iso === id)) ||
          d.iso === 'WORLDWIDE'
        );
      });

      if (result) {
        if (result.location_type === 'custom-area') {
          result.name = 'the area selected';
        } else if (result.location_type === 'worldwide') {
          result.name = 'the world';
        }
      }
      return result || null;
    },
    ...queryOptions,
  });
}

export function useHighlightedPlaces(
  queryOptions: UseQueryOptions<DataResponse, Error, Location[]> = {}
) {
  return useQuery(['locations'], fetchLocations, {
    placeholderData: {
      data: [],
      metadata: null,
    },
    select: ({ data }) =>
      data?.filter((d) => Object.values(HIGHLIGHTED_PLACES).includes(d.location_id)),
    ...queryOptions,
  });
}
