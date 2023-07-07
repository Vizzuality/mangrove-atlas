import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { numberFormat } from 'lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import type { UseParamsOptions } from 'types/widget';

import ClimateWatchAPI from 'services/api';

import type { DataResponse, InternationalStatusTypes, Data } from './types';

// widget data
export function useClimateWatchNDCS(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, { data: Data[] }>
): InternationalStatusTypes {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { iso, name: location, location_id },
  } = useLocation(locationType, id);

  const { indicators } = params || { indicators: 'ndc' };

  const fetchClimateWatchNDCS = () =>
    console.log(ClimateWatchAPI) ||
    ClimateWatchAPI.request({
      method: 'GET',
      url: '/ndcs',
      params: {
        ...(!!iso && iso !== 'worldwide' && { location: iso }),
        params: {
          indicators,
          ...params,
        },
      },
      ...queryOptions,
    }).then((response) => response.data);
  return useQuery(['climate-watch-ndcs-', params, iso], fetchClimateWatchNDCS, {
    select: (data) => data,
    ...queryOptions,
  });
}
