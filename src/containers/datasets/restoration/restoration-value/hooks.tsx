import { locationTypeAtom, locationIdAtom } from '@/store/locations';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { useLocation } from '@/containers/datasets/locations/hooks';
import type { LocationTypes } from '@/containers/datasets/locations/types';

import API from 'services/api';

import type { Data, DataResponse } from './types';

type UseParamsOptions = {
  slug: 'fisheries' | 'restoration-value';
};

export function useMangroveEcosystemServices(
  params?: UseParamsOptions,
  queryOptions?: Omit<UseQueryOptions<DataResponse, Error, Data>, 'queryKey' | 'queryFn'>
) {
  const locationType = useAtomValue(locationTypeAtom) as LocationTypes;
  const id = useAtomValue(locationIdAtom);
  const {
    data: { name: location, id: currentLocation, location_id },
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
  return useQuery({
    queryKey: ['ecosystem-services', params, location_id],
    queryFn: fetchMangroveEcosystemServices,
    select: ({ data, metadata }) => ({
      ...data,
      ...metadata,
      chartData: data,
      location,
    }),
    ...queryOptions,
  });
}
