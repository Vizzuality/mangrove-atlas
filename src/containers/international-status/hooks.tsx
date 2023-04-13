import { useMemo } from 'react';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

// widget data
export function useMangroveInternationalStatus(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions = {}
) {
  const fetchMangroveInternationalStatus = () =>
    API.request({
      method: 'GET',
      url: '/widgets/international_status',
      params,
    }).then((response) => response);

  const query = useQuery(['international-status', params], fetchMangroveInternationalStatus, {
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
