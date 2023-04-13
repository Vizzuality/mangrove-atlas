import { useMemo } from 'react';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

// widget data
export function useMangroveEmissionsMitigation(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions = {}
) {
  const fetchMangroveEmissionsMitigation = () =>
    API.request({
      method: 'GET',
      url: '/widgets/mitigation_potentials',
      params,
    }).then((response) => response);

  const query = useQuery(['mitigation-potentials', params], fetchMangroveEmissionsMitigation, {
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
