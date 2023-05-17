import { useMemo } from 'react';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

type DataResponse = {
  data: [];
  metadata: {
    years: [];
    start_year: number;
    end_year: number;
    units: { value: string }[];
  };
};

// widget data
export function useMangroveHabitatChange(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions<DataResponse>
) {
  const fetchMangroveHabitatChange = () =>
    API.request({
      method: 'GET',
      url: '/widgets/country_ranking',
      params,
    }).then((response) => response.data);

  const query = useQuery(['country_ranking', params], fetchMangroveHabitatChange, {
    placeholderData: {
      data: [],
      metadata: {
        years: [],
        start_year: null,
        end_year: null,
        units: null,
      },
    },

    ...queryOptions,
  });

  const { data } = query;
  return useMemo(() => {
    const years = data?.metadata?.years;
    const unit = data?.metadata?.units[0]?.value;
    const chartData = data.data;
    const defaultStartYear = data.metadata?.start_year;
    const defaultEndYear = data.metadata?.end_year;

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
