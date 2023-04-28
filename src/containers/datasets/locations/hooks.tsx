import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

import API from 'services/api';

import type { Location } from './types';

// widget data
export function useLocations(
  queryOptions: UseQueryOptions<
    {
      data: Location[];
    },
    unknown,
    Location[],
    string[]
  > = {}
) {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: '/locations',
  };

  const fetchLocations = () => API.request(config).then((response) => response.data);
  const query = useQuery(['locations'], fetchLocations, {
    placeholderData: {
      data: [],
    },
    select: (data) => data?.data,
    ...queryOptions,
  });

  return query;
}

export function useLocation(location, queryOptions = {}) {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: '/locations',
  };

  const fetchLocations = () => API.request(config).then((response) => response.data);

  return useQuery(['locations', location], fetchLocations, {
    placeholderData: { name: 'Worldwide', location_id: 'worldwide' },
    select: (data) => ({
      ...data?.data?.filter((d) => d.location_id === location)[0],
    }),
    ...queryOptions,
  });
}
