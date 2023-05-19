import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useLocation } from 'containers/datasets/locations/hooks';

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
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse>
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0];
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(locationType, id);
  const currentYear = 2020;
  const fetchMangroveHabitatChange = () =>
    API.request({
      method: 'GET',
      url: '/widgets/country_ranking',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        year: currentYear,
        ...params,
      },
      ...queryOptions,
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
    const unit = data?.metadata?.units?.[0]?.value || [];
    const chartData = data?.data;
    const defaultStartYear = data?.metadata?.start_year;
    const defaultEndYear = data?.metadata?.end_year;

    return {
      ...query,
      years,
      unit,
      location,
      chartData,
      defaultStartYear,
      defaultEndYear,
    };
  }, [query, data]);
}
