import { useMemo } from 'react';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

// widget data
export function useMangroveHabitatChange(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions = {}
) {
  const fetchMangroveHabitatChange = () =>
    API.request({
      method: 'GET',
      url: '/widgets/country_ranking',
      params,
    }).then((response) => response);

  const query = useQuery(['country_ranking', params], fetchMangroveHabitatChange, {
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
