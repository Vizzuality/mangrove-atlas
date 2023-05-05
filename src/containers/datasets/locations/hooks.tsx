import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { LngLatBounds, LngLat } from 'mapbox-gl';

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

export function useLocation(location, queryOptions = {}) {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: '/locations',
  };

  const fetchLocations = () => API.request(config).then((response) => response.data);

  return useQuery(['locations', location], fetchLocations, {
    placeholderData: { name: 'Worldwide', location_id: 'worldwide' },
    select: (data) => ({
      ...data?.data?.filter((d) => d.location_id === location)[0],
    }),
    ...queryOptions,
  });
}
