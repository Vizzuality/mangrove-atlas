import { useMemo } from 'react';

import { useQuery } from 'react-query';

import WIDGETS from 'services/widgets';

export function useWidget({ params = {}, wId }) {

  console.log({params, wId})

  const query = useQuery(`${wId}`, async () => WIDGETS.request({
    method: 'GET',
    url: `/${wId}`,
    params: params
  }), {
    enabled: !!wId
  });

  const { data } = query;

  console.log({data})

  return useMemo(() => {
    return {
      ...query,
      data: data?.data?.data || [],
      metadata: data?.data?.meta || {},
    };
  }, [query, data?.data?.data, data?.data?.meta]);
}
