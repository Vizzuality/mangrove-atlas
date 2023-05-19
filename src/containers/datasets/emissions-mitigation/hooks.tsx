import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useLocation } from 'containers/datasets/locations/hooks';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

// widget data
export function useMangroveEmissionsMitigation(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions
) {
  const {
    query: { locationType, id },
  } = useRouter();
  const {
    data: { name, id: currentLocation, location_id },
  } = useLocation(locationType, id);
  const fetchMangroveEmissionsMitigation = () =>
    API.request({
      method: 'GET',
      url: '/widgets/mitigation_potentials',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
      ...queryOptions,
    }).then((response) => response);

  const query = useQuery(['mitigation-potentials', params], fetchMangroveEmissionsMitigation, {
    placeholderData: [],
    select: (data) => ({
      data,
    }),
    ...queryOptions,
  });

  const DATA = useMemo(() => {
    return {
      location,
    };
  }, [query]);

  return useMemo(() => {
    return {
      ...query,
      data: DATA,
    } as typeof query;
  }, [query]);
}
