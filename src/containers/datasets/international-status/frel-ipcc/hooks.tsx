import { useMemo } from 'react';

import { numberFormat } from '@/lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useSyncLocation } from 'hooks/use-sync-location';

import { useLocation } from '@/containers/datasets/locations/hooks';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import type { Data, DataResponse, InternationalStatusTypes } from './types';

// widget data
export function useMangroveInternationalStatus(
  params?: UseParamsOptions,
  queryOptions?: Omit<UseQueryOptions<DataResponse, Error>, 'queryKey' | 'queryFn' | 'select'>
): InternationalStatusTypes {
  const { type: locationType, id } = useSyncLocation();
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(id, locationType);

  const fetchMangroveInternationalStatus = (): Promise<DataResponse> =>
    API.request({
      method: 'GET',
      url: '/widgets/international_status',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
    }).then((response) => response.data);

  const query = useQuery<DataResponse>({
    queryKey: ['international-status', params, location_id],
    queryFn: fetchMangroveInternationalStatus,
    placeholderData: {
      data: [
        {
          base_years: null, // TO - DO change to number in API
          ipcc_wetlands_suplement: null,
          ndc: null,
          ndc_adaptation: null,
          ndc_blurb: null,
          ndc_mitigation: null,
          ndc_reduction_target: null,
          ndc_target: null,
          ndc_target_url: null,
          ndc_updated: null,
          pledge_summary: null,
          pledge_type: null,
          target_years: null,
          isLoading: null,
          isFetching: null,
          isPlaceholderData: null,
        },
      ],
      metadata: null,
    } as unknown as DataResponse,

    ...queryOptions,
  });

  const { data, isLoading, isFetched, isPlaceholderData } = query;
  const noData = !data.data?.length;

  return useMemo(() => {
    const {
      pledge_type,
      ndc_target,
      ndc_reduction_target,
      target_years,
      ndc_target_url,
      ndc_updated,
      ndc_mitigation,
      ndc_adaptation,
      ipcc_wetlands_suplement,
      frel,
      year_frel,
      fow,
      ndc_blurb,
    } = data?.data?.[0] || {};

    const hasNDCTarget = !!ndc_target && ndc_target > 0;
    const hasNDCReductionTarget = !!ndc_reduction_target && ndc_reduction_target > 0;
    const targetYears = target_years?.length > 4 ? 's' : '';
    const reductionTargetSentence =
      !!ndc_reduction_target && ` is a ${ndc_reduction_target}% reduction`;
    const targetYearsSentence =
      !!target_years &&
      (!!hasNDCTarget || !!hasNDCReductionTarget) &&
      ` by target year${targetYears} ${target_years}`;
    const ndcTargetSentence =
      !!ndc_target && `. This represents a reduction of ${ndc_target} Mt CO₂e/yr`;
    return {
      location,
      pledge_type,
      ndc_target,
      ndc_reduction_target,
      target_years,
      ndc_target_url,
      ndc_updated,
      ndc_mitigation,
      ndc_adaptation,
      ipcc_wetlands_suplement,
      frel: numberFormat(frel),
      year_frel,
      fow,
      ndc_blurb,
      reductionTargetSentence,
      targetYearsSentence,
      ndcTargetSentence,
      hasNDCTarget,
      hasNDCReductionTarget,
      isLoading,
      isFetched,
      isPlaceholderData,
      noData,
    };
  }, [data, isFetched, isLoading, isPlaceholderData, location, noData]);
}
