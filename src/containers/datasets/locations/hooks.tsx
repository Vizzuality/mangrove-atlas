import { useQuery, UseQueryOptions, useQueryClient, useQueries } from '@tanstack/react-query';

import API from 'services/api';

import type { Location, LocationTypes } from './types';

export type DataResponse = {
  data: Location[];
  metadata: unknown;
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
  id?: Location['location_id'],
  locationType?: LocationTypes,
  queryOptions: UseQueryOptions<{ data: DataResponse['data'][0] }, Error, Location> = {}
) {
  const _id = locationType && ['wdpa', 'country'].includes(locationType) ? id : 'worldwide';

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
