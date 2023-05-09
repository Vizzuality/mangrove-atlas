import { useMemo } from 'react';

import { numberFormat } from 'lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import type { DataResponse, InternationalStatusTypes } from './types';

// widget data
export function useMangroveInternationalStatus(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions<AxiosResponse<DataResponse>> = {}
): InternationalStatusTypes {
  const fetchMangroveInternationalStatus = () =>
    API.request({
      method: 'GET',
      url: '/widgets/international_status',
      params,
    }).then((response) => response.data);

  const query = useQuery(['international-status', params], fetchMangroveInternationalStatus, {
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
        },
      ],
      metadata: null,
    },

    ...queryOptions,
  });

  const { data } = query;

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
    };
  }, [data]);
}
