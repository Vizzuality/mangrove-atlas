import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { orderBy } from 'lodash-es';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import type { UseParamsOptions } from 'types/widget';

import { ClimateWatchAPI } from 'services/api';

import type {
  DataResponse,
  DataResponseDocuments,
  IndicatorsParams,
  Data,
  DataResponseContentOverview,
} from './types';

// widget data
export function useClimateWatchNDCS(
  indicators: IndicatorsParams,
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, Data>
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { iso },
  } = useLocation(id, locationType);

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
    select: ({ indicators }) => {
      return indicators?.reduce((acc, value) => {
        return {
          ...acc,
          iso,
          [value.slug]: {
            info: !!value?.description ? value?.description : value?.name,
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
  queryOptions?: UseQueryOptions<DataResponseDocuments, Error>
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { iso },
  } = useLocation(id, locationType);

  const fetchClimateWatchNDCSCountriesDocs = () =>
    ClimateWatchAPI.request({
      method: 'GET',
      url: '/ndcs/countries_documents',
      params: {
        ...(!!iso && iso !== 'worldwide' && { location: iso }),
        ...params,
      },
      ...queryOptions,
    }).then((response) => response.data);

  return useQuery(
    ['climate-watch-ndcs-countries_documents', params, iso],
    fetchClimateWatchNDCSCountriesDocs,
    {
      select: (data) => {
        return {
          ...data,
          update: orderBy(data?.data?.[iso], ['ordering'], ['desc'])[0],
        };
      },
      ...queryOptions,
    }
  );
}

export function useClimateWatchNDCSContentOverview(
  queryOptions?: UseQueryOptions<DataResponseContentOverview, Error>
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { iso },
  } = useLocation(id, locationType);

  const fetchClimateWatchNDCSContentOverview = () =>
    ClimateWatchAPI.request({
      method: 'GET',
      url: `/ndcs/${iso}/content_overview`,
      ...queryOptions,
    }).then((response) => response.data);

  return useQuery(
    ['climate-watch-ndcs-content_overview', iso],
    fetchClimateWatchNDCSContentOverview,
    {
      select: ({ values }) =>
        values.reduce((acc, item) => {
          const cleanedValue = item.value
            .replace(/^\"|\"$/g, '')
            .replace(/\\"/g, '')
            .replace(/<br>/g, '\n')
            .replace(/\\?"/g, '')
            .trim();

          acc[item.slug] = cleanedValue;
          acc.document_slug = item.document_slug;
          return acc;
        }, {}),
      ...queryOptions,
    }
  );
}
