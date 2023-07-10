import { useQuery, UseQueryOptions, useQueryClient } from '@tanstack/react-query';

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

export const fetchLocation = (locationId: Location['location_id']) =>
  API.request<{ data: DataResponse['data'][0] }>({
    method: 'GET',
    url: `/locations/${locationId}`,
  }).then((response) => response.data);

export function useLocations<T = DataResponse>(
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
  id: Location['location_id'],
  queryOptions: UseQueryOptions<{ data: DataResponse['data'][0] }, Error, Location> = {}
) {
  const _id = ['wdpa', 'country'].includes(locationType) ? id : 'worldwide';

  return useQuery(['location', locationType, _id], () => fetchLocation(_id), {
    placeholderData: { data: {} as DataResponse['data'][0] },

    select: ({ data }) => {
      if (locationType === 'custom-area') {
        return {
          name: 'the area selected',
          id: 'custom-area',
          iso: 'custom-area',
          location_id: 'custom-area',
          location_type: 'custom-area',
        };
      }

      if (data.location_type === 'worldwide') {
        data.name = 'the world';
      }
      return data;
    },
    ...queryOptions,
  });
}

export function useHighlightedPlaces(
  queryOptions: UseQueryOptions<DataResponse, Error, Location[]> = {}
) {
  const queryClient = useQueryClient();

  return useQuery(['highlighted-locations'], fetchLocations, {
    placeholderData: queryClient.getQueryData(['locations']) || {
      data: [],
      metadata: null,
    },
    select: ({ data }) =>
      data?.filter((d) => Object.values(HIGHLIGHTED_PLACES).includes(d.location_id)),
    ...queryOptions,
  });
}
