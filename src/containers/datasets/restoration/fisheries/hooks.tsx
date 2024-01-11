import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

type UseParamsOptions = {
  slug: 'fisheries' | 'restoration-value';
};

type Data = {
  indicator: string;
  value: number;
};

import API from 'services/api';

import type { DataResponse } from './types';
// widget data

export function useMangroveEcosystemServices(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, Data[]>
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { id: currentLocation, location_id },
  } = useLocation(id, locationType);

  const fetchMangroveEcosystemServices = () =>
    API.request({
      method: 'GET',
      url: '/widgets/ecosystem_services',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
    }).then((response) => response.data);

  return useQuery(['ecosystem-services', params, location_id], fetchMangroveEcosystemServices, {
    select: ({ data }) => data,
    ...queryOptions,
  });
}
