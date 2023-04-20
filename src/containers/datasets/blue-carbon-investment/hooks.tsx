import { useMemo } from 'react';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

// widget data
export function useMangroveBlueCarbonInvestment(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions = {}
) {
  const fetchMangroveBlueCarbonInvestment = () =>
    API.request({
      method: 'GET',
      url: '/widgets/blue_carbon_investment',
      params,
    }).then((response) => response);

  const query = useQuery(['blue-carbon-investment', params], fetchMangroveBlueCarbonInvestment, {
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
