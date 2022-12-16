import { useMemo } from 'react';

import { useQuery } from 'react-query';

import WIDGETS from 'services/widgets';

export function useHabitatExtent({ params = {} }) {

  const query = useQuery('habitat_extent', async () => WIDGETS.request({
    method: 'GET',
    url: '/habitat_extent',
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