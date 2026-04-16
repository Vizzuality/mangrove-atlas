import { formatNumberNearestInteger } from '@/lib/format';

import { locationTypeAtom, locationIdAtom } from '@/store/locations';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { useLocation } from '@/containers/datasets/locations/hooks';
import type { LocationTypes } from '@/containers/datasets/locations/types';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import type { Data, DataResponse } from './types';

// widget data
export function useMangroveRestoration(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, Data & { restorable_area_perc: string }>
) {
  const locationType = useAtomValue(locationTypeAtom) as LocationTypes;
  const id = useAtomValue(locationIdAtom);
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(id, locationType);

  const fetchMangroveRestoration = () =>
    API.request<DataResponse>({
      method: 'GET',
      url: '/widgets/restoration-potential',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
    }).then((response) => response.data);

  return useQuery({
    queryKey: ['restoration-potential', params, location_id],
    queryFn: fetchMangroveRestoration,
    select: ({ data, metadata }) => ({
      ...metadata,
      ...data,
      restorable_area_perc: formatNumberNearestInteger(data?.restorable_area_perc),
      location,
    }),
    ...queryOptions,
  });
}
