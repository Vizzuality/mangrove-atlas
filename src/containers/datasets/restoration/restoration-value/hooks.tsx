import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useLocation } from 'containers/datasets/locations/hooks';

import API from 'services/api';

import type { Data, DataResponse } from './types';

// widget data

type UseParamsOptions = {
  slug: 'fisheries' | 'restoration-value';
};

export function useMangroveEcosystemServices(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, Data>
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0];
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(locationType, id);
  const fetchMangroveEcosystemServices = () =>
    API.request({
      method: 'GET',
      url: '/widgets/ecosystem_services',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
    }).then((response) => response.data);
  return useQuery(['ecosystem-services', params], fetchMangroveEcosystemServices, {
    select: ({ data, metadata }) => ({
      ...data,
      ...metadata,
      chartData: data,
      location,
    }),
    ...queryOptions,
  });
}
