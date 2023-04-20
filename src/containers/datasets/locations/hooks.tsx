import { useMemo } from 'react';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

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
    select: (data) => data.data,
    ...queryOptions,
  });

  return query;
}

export function useLocationIso(location, queryOptions = {}) {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: '/locations',
  };

  const fetchLocations = () => API.request(config).then((response) => response.data);

  const query = useQuery(['locations'], fetchLocations, {
    placeholderData: [],
    select: (data) => ({
      data: data.data?.filter((d) => d.location_id === location)[0],
    }),
    ...queryOptions,
  });

  const { data } = query;

  return useMemo(() => {
    return {
      ...data,
    };
  }, [location]);
}
