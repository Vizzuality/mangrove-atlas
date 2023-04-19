import { useMemo } from 'react';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import API from 'services/api';

// widget data
export function useLocations(queryOptions: UseQueryOptions = {}) {
  const fetchLocations = () =>
    API.request({
      method: 'GET',
      url: '/locations',
    }).then((response) => response.data);

  const query = useQuery(['locations'], fetchLocations, {
    placeholderData: [],
    select: (data) => ({
      data,
    }),
    ...queryOptions,
  });

  return useMemo(() => {
    return {
      ...query,
    } as typeof query;
  }, [query]);
}
