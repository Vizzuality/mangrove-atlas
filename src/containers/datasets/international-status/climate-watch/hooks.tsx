import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import type { UseParamsOptions } from 'types/widget';

import { ClimateWatchAPI } from 'services/api';

import type { DataResponse, DataResponseDocuments, Indicator, IndicatorsParams } from './types';

// widget data
export function useClimateWatchNDCS(
  indicators: IndicatorsParams,
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, Indicator[]>
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { iso },
  } = useLocation(locationType, id);

  const fetchClimateWatchNDCS = () =>
    ClimateWatchAPI.request({
      method: 'GET',
      url: '/ndcs',
      params: {
        ...(!!iso && iso !== 'worldwide' && { location: iso }),

        ...indicators,
      },
      ...queryOptions,
    }).then((response: AxiosResponse['data']) => response.data);
  return useQuery(['climate-watch-ndcs', params, iso, indicators], fetchClimateWatchNDCS, {
    select: ({ indicators }: { indicators: Indicator[] }) => {
      return {
        ...indicators,
        emissions: indicators?.find(({ slug }) => slug === 'M_TarA4'),
        emisssions_perc: indicators?.find(({ slug }) => slug === 'M_TarB1'),

        mitigation: indicators?.find(({ slug }) => slug === 'mitigation_contribution_type'),

        type_of_mitigation: indicators?.find(({ slug }) => slug === 'mitigation_contribution_type'),
        adaptation: indicators?.find(({ slug }) => slug === 'adaptation'),
        base_years: indicators?.find(({ slug }) => slug === 'base_years'),
        target_years: indicators?.find(({ slug }) => slug === 'M_TarYr'),
        updated_status: indicators?.find(({ slug }) => slug === 'updated_status'),
      };
    },
    ...queryOptions,
  });
}

export function useClimateWatchNDCSCountriesDocs(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<
    DataResponseDocuments,
    Error,
    DataResponseDocuments & { hasNDC: boolean }
  >
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { iso },
  } = useLocation(locationType, id);

  const fetchClimateWatchNDCS = () =>
    ClimateWatchAPI.request({
      method: 'GET',
      url: '/ndcs/countries_documents',
      params: {
        ...(!!iso && iso !== 'worldwide' && { location: iso }),
        ...params,
      },
      ...queryOptions,
    }).then((response) => response.data);

  return useQuery(['climate-watch-ndcs-countries_documents', params, iso], fetchClimateWatchNDCS, {
    select: (data) => {
      return {
        ...data,
        hasNDC: data?.data?.[iso]?.find(({ slug }) => slug === 'first_ndc').is_ndc,
      };
    },
    ...queryOptions,
  });
}
