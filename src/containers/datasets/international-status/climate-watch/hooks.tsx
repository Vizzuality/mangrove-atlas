import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { useSyncLocation } from 'hooks/use-sync-location';

import { useLocation } from '@/containers/datasets/locations/hooks';

import type { UseParamsOptions } from 'types/widget';

import { ClimateWatchAPI } from 'services/api';

import type {
  Data,
  DataResponse,
  DataResponseContentOverview,
  DataResponseDocuments,
  IndicatorsParams,
  UseClimateWatchNDCSCountriesDocsParamsOptions,
} from './types';

// widget data
export function useClimateWatchNDCS(
  indicators: IndicatorsParams,
  params?: UseParamsOptions,
  queryOptions?: Omit<
    UseQueryOptions<DataResponse, Error, Record<string, any>>,
    'queryKey' | 'queryFn'
  >
) {
  const { type: locationType, id } = useSyncLocation();
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
  return useQuery({
    queryKey: ['climate-watch-ndcs', params, iso, indicators],
    queryFn: fetchClimateWatchNDCS,
    select: ({ indicators }) => {
      return indicators?.reduce((acc, value) => {
        return {
          ...acc,
          iso,
          [value.slug]: {
            info: !!value?.description ? value?.description : value?.name,
            [iso]: value.locations[iso][0],
            // .find(
            //   ({ document_slug }) =>
            //     document_slug === 'third_ndc' ||
            //     document_slug === 'second_ndc' ||
            //     document_slug === 'revised_first_ndc' ||
            //     document_slug === 'first_ndc'
            // ),
          },
        };
      }, {});
    },
    ...queryOptions,
  });
}

type CountriesDocsResult = DataResponseDocuments & {
  update: { value?: string; url?: string };
};

export function useClimateWatchNDCSCountriesDocs(
  params?: UseClimateWatchNDCSCountriesDocsParamsOptions,
  queryOptions?: Omit<
    UseQueryOptions<DataResponseDocuments, Error, CountriesDocsResult>,
    'queryKey' | 'queryFn' | 'select'
  >
) {
  const { type: locationType, id } = useSyncLocation();
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
    }).then((response) => response.data);
  return useQuery<DataResponseDocuments, Error, CountriesDocsResult>({
    queryKey: ['climate-watch-ndcs-countries_documents', params, iso],
    queryFn: fetchClimateWatchNDCSCountriesDocs,
    select: (data) => {
      return {
        ...data,
        update: {
          value: data?.data?.[iso]?.find(({ slug }) => params?.documentSlug === slug)?.long_name,
          url: data?.data?.[iso]?.find(({ slug }) => params?.documentSlug === slug)?.url,
        },
      };
    },
    ...queryOptions,
  });
}

export function useClimateWatchNDCSContentOverview(
  queryOptions?: Omit<
    UseQueryOptions<DataResponseContentOverview, Error, Record<string, string>>,
    'queryKey' | 'queryFn' | 'select'
  >
) {
  const { type: locationType, id } = useSyncLocation();
  const {
    data: { iso },
  } = useLocation(id, locationType);

  const fetchClimateWatchNDCSContentOverview = () =>
    ClimateWatchAPI.request({
      method: 'GET',
      url: `/ndcs/${iso}/content_overview`,
    }).then((response) => response.data);

  return useQuery<DataResponseContentOverview, Error, Record<string, string>>({
    queryKey: ['climate-watch-ndcs-content_overview', iso],
    queryFn: fetchClimateWatchNDCSContentOverview,
    select: ({ values }) => {
      const update = values.find(({ slug }) => slug === 'indc_summary');
      const content = values.reduce<Record<string, string>>((acc, item) => {
        const cleanedValue = item.value
          .replace(/^\"|\"$/g, '')
          .replace(/\\"/g, '')
          .replace(/<br>/g, '\n')
          .replace(/\\?"/g, '')
          .trim();

        acc[item.slug] = cleanedValue;
        acc.document_slug = item.document_slug;
        return acc;
      }, {});
      return {
        ...content,
        documentSlug: update.document_slug,
      };
    },
    ...queryOptions,
  });
}
