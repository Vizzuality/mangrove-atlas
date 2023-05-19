import { useQuery, UseQueryOptions, useQueryClient } from '@tanstack/react-query';

import API from 'services/api';

import type { Location } from './types';

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

// export function useLocationName(locationType: LocationTypes, id: number) {
//   const {
//     data: { name, location_id },
//   } = useLocation(locationType, id);

//   if (location_id === 'custom-area') return 'the area selected';
//   if (location_id === 'worldwide') return 'the world';
//   else return name;
// }

export function useLocation(
  locationType: string | string[],
  id: string | string[],
  queryOptions: UseQueryOptions<DataResponse, Error, Location> = {}
) {
  const queryClient = useQueryClient();
  return useQuery(['locations'], fetchLocations, {
    placeholderData: queryClient.getQueryData(['locations']) || {
      data: [],
      metadata: null,
    },
    select: (data) => ({
      ...data?.data?.find(
        (d) =>
          (d.location_type === locationType && (d.location_id === id || d.iso === id)) ||
          d.iso === 'WORLDWIDE'
      ),
    }),
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

// export function useLocationName(locationType: LocationTypes, id: number) {
//   const {
//     data: { name, location_id },
//   } = useLocation(locationType, id);

//   if (location_id === 'custom-area') return 'the area selected';
//   if (location_id === 'worldwide') return 'the world';
//   else return name;
// }
