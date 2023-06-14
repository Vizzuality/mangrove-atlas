import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import API from 'services/api';

import type { Data, DataResponse } from './types';

const FAKE_DATA = {
  data: [
    {
      indicator: 'floods',
      sources: [
        {
          source: 'voluptatem',
          unit: 'GDP',
          years: [2016],
          data_source: [
            {
              year: 2016,
              value: 68950.02,
              layer_info: 'Enim repellat pariatur est.',
              layer_link: 'http://kutch-spencer.com/moises',
              download_link: 'http://kutch-spencer.com/moises',
            },
          ],
        },
      ],
    },
  ],
  metadata: {
    location_id: '226',
    other_resources: [
      {
        name: 'voluptatem',
        description: 'Enim repellat pariatur. Earum modi eos. Libero tempora exercitationem.',
        link: 'http://kutch-spencer.com/moises',
      },
    ],
    note: null,
  },
};
// widget data

type UseParamsOptions = {
  slug: 'fisheries' | 'restoration-value';
};

export function useNationalDashboard(params?: UseParamsOptions, queryOptions?: UseQueryOptions) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = params?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { location_id },
  } = useLocation(locationType, id);
  const fetchMangroveNationalDashboard = () =>
    API.request({
      method: 'GET',
      url: '/widgets/national_dashboard',
      params: {
        //  ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        // location_id: currentLocation,
        ...params,
      },
    }).then((response) => response.data);
  return useQuery(['national_dashboard', params, location_id], fetchMangroveNationalDashboard, {
    select: (data) => FAKE_DATA,
    ...queryOptions,
  });
}
