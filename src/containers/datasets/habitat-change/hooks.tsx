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
    placeholderData: {
      data: [],
      metadata: {
        years: [],
      },
    },

    ...queryOptions,
  });

  const { data } = query;
  return useMemo(() => {
    const years = data.data.metadata?.years;
    const unit = data.data.metadata?.units[0]?.value;
    const chartData = data.data.data;
    const defaultStartYear = data.data.metadata?.start_year;
    const defaultEndYear = data.data.metadata?.end_year;
    return {
      ...query,
      years,
      unit,
      chartData,
      defaultStartYear,
      defaultEndYear,
    };
  }, [query, data]);
}
