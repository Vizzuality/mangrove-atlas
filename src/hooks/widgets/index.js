import { useMemo } from 'react';

import { useQuery } from 'react-query';

import WIDGETS from 'services/widgets';

export function useHabitatExtent({ params = {} }) {

  const query = useQuery('habitat-extent', async () => WIDGETS.request({
    method: 'GET',
    url: '/habitat_extent',
    params: params
  }));

  const { data } = query;

  return useMemo(() => {
    return {
      ...query,
      data: data?.data?.data || [],
      metadata: data?.data?.meta || {},
    };
  }, [query, data?.data?.data, data?.data?.meta]);
}

export function useNetChange({ params = {} }) {

  const query = useQuery('net-change', async () => WIDGETS.request({
    method: 'GET',
    url: '/net_change',
    params: params,
  }));

  const { data } = query;

  return useMemo(() => {
    return {
      ...query,
      data: data?.data?.data || [],
      metadata: data?.data?.meta || {},
    };
  }, [query, data?.data?.data, data?.data?.meta]);
}