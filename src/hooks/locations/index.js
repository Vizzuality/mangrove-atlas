import { useMemo } from 'react';

import { useQuery } from 'react-query';

import LOCATIONS from 'services/locations';

export function useLocations({ params = {} }) {

  const query = useQuery('locations', async () => LOCATIONS.request({
    method: 'GET',
    url: '/',
    params: params
  }));

  const { data } = query;

  return useMemo(() => {
    const parsedData = Array.isArray(data?.data?.data) ? data?.data?.data : [];

    return {
      ...query,
      data: parsedData,
    };
  }, [query, data?.data?.data]);
}