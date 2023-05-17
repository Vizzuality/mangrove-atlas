import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { LngLat } from 'mapbox-gl';

import API from 'services/api';

type Bounds = {
  type: 'polygon';
  coordinates: LngLat[];
};

type Data = {
  area_m2: number;
  bounds: Bounds;
  coast_length_m: number;
  created_at: string;
  id: number;
  iso: string;
  location_id: string;
  location_type: 'country';
  name: string;
  perimeter_m: number;
};

type DataResponse = {
  data: Data[];
  metadata: unknown;
};

export const HIGHLIGHTED_PLACES = {
  rufiji: '0edd0ebb-892b-5774-8ce5-08e0ba7136b1',
  saloum: '4a79230b-7ecb-58ae-ba0d-0f57faa2a104',
};

// widget data
export function useLocations(queryOptions: UseQueryOptions<DataResponse> = {}) {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: '/locations',
  };

  const fetchLocations = () => API.request(config).then((response) => response.data);
  const query = useQuery(['locations'], fetchLocations, {
    placeholderData: {
      data: [],
    },
    select: (data) => data?.data,
    ...queryOptions,
  });

  return query;
}

export function useLocation(
  locationType: string | string[],
  id: string | string[],
  queryOptions: UseQueryOptions<DataResponse> = {}
) {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: '/locations',
  };

  const fetchLocations = () => API.request(config).then((response: AxiosResponse) => response.data);
  return useQuery(['locations'], fetchLocations, {
    placeholderData: [],
    select: (data) => ({
      ...data?.data?.find(
        (d) =>
          (d.location_type === locationType && (d.location_id === id || d.iso === id)) ||
          d.iso === 'WORLDWIDE'
      ),
    }),
    ...queryOptions,
  });
}

export function useHighlightedPlaces(queryOptions: UseQueryOptions<Location[]> = {}) {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: '/locations',
  };
  const fetchLocations = () => API.request(config).then((response) => response.data);
  return useQuery(['locations'], fetchLocations, {
    placeholderData: {
      data: [],
    },
    select: ({ data }) =>
      data?.filter((d) => Object.values(HIGHLIGHTED_PLACES).includes(d.location_id)),
    ...queryOptions,
  });
}
