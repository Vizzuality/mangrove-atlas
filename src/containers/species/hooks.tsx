import { useMemo } from 'react';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

// widget data
export function useMangroveSpecies(params: UseParamsOptions, queryOptions: UseQueryOptions = {}) {
  const fetchMangroveSpecies = () =>
    API.request({
      method: 'GET',
      url: '/widgets/biodiversity',
      params,
    }).then((response) => response);

  const query = useQuery(['biodiversity', params], fetchMangroveSpecies, {
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
