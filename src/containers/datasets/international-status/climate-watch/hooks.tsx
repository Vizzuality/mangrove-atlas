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
      return indicators?.reduce((acc, value) => {
        console.log(value);
        return {
          ...acc,
          iso,
          [value.slug]: {
            info: `${value?.name}. ${!!value?.description ? value?.description : ''}`,
            [iso]: value.locations[iso].find(
              ({ document_slug }) =>
                document_slug === 'second_ndc' ||
                document_slug === 'revised_first_ndc' ||
                document_slug === 'first_ndc'
            ),
          },
        };
      }, {});
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
        update: data?.data?.[iso]?.find(
          ({ slug }) =>
            slug === 'second_ndc' || slug === 'revised_first_ndc' || slug === 'first_ndc'
        ),
      };
    },
    ...queryOptions,
  });
}
