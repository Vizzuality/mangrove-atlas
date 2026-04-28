import { useQuery, UseQueryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type GeoJSON from 'geojson';

import API from 'services/api';

export type UserLocationType = 'system' | 'custom';

type SystemLocation = {
  id: number;
  name: string;
  iso: string;
  location_type: UserLocationType;
  bounds: Bounds | null;
};

type UserLocation = {
  id: number;
  name: string;
  position: number | null;
  bounds: Bounds | null;
  alerts_enabled: boolean;
  created_at: string; // date-time
  updated_at: string; // date-time

  location_type: UserLocationType;

  // Present when location_type is 'system'
  location: SystemLocation | null;

  // Present when location_type is 'custom'
  custom_geometry: CustomGeometry | null;

  // If your API actually returns it (you had it before):
  user_id?: string;
};

export type MetadataUserLocation = {
  max_locations: number;
  current_count: number;
};

export type UserLocationsResponse = {
  data: UserLocation[];
  meta: MetadataUserLocation;
};

export type UserSitesResponse = {
  id: number;
  site_name: string;
  landscape_id: number;
  landscape_name: string;
  section_last_updated: string;
  section_data_visibility: {
    '1': 'public' | 'private';
    '2': 'public' | 'private';
    '3': 'public' | 'private';
    '4': 'public' | 'private';
    '5': 'public' | 'private';
    '6': 'public' | 'private';
    '7': 'public' | 'private';
    '8': 'public' | 'private';
    '9': 'public' | 'private';
    '10': 'public' | 'private';
  };
}[];

type Bounds = {
  description: string;
  north: number;
  south: number;
  east: number;
  west: number;
};

export type CustomGeometry = {
  description: string;
  type: 'Polygon';
  coordinates: GeoJSON.Polygon['coordinates'];
};

type BaseCreateBody = {
  // Display name for the saved location
  name: string;

  // Map viewport bounds for the location
  bounds?: Bounds;

  // Display order position
  position?: number;

  // Whether location-based alerts are enabled for this location. Defaults to true
  alerts_enabled?: boolean;
};

//  System location: requires location_id, forbids custom_geometry
type UserLocationCreateBodySystem = BaseCreateBody & {
  location_type: 'system';
  location_id: number;
  custom_geometry?: never;
};

//  Custom location: requires custom_geometry, forbids location_id
type UserLocationCreateBodyCustom = BaseCreateBody & {
  location_type: 'custom';
  custom_geometry: CustomGeometry;
  location_id?: never;
};

type UserLocationCreateBody = UserLocationCreateBodySystem | UserLocationCreateBodyCustom;

export const fetchUserSites = () =>
  API.request<UserSitesResponse>({
    method: 'GET',
    url: '/sites',
  }).then((r) => r.data);

const fetchUserLocations = () =>
  API.request<UserLocationsResponse>({
    method: 'GET',
    url: '/user_locations',
  }).then((r) => r.data);

const updateUserLocation = (id: UserLocation['id'], body: Partial<UserLocation>) =>
  API.request<{ data: UserLocation }>({
    method: 'PATCH',
    url: `/user_locations/${id}`,
    data: body,
  }).then((r) => r.data);

const deleteUserLocation = (id: UserLocation['id']) =>
  API.request<void>({
    method: 'DELETE',
    url: `/user_locations/${id}`,
  }).then((r) => r.data);

const userLocationsKeys = {
  all: ['user_locations'] as const,
  list: () => [...userLocationsKeys.all, 'list'] as const,
  detail: (id: number) => [...userLocationsKeys.all, 'detail', id] as const,
};

export function useGetUserSites<T = UserSitesResponse>(
  queryOptions?: Omit<UseQueryOptions<UserSitesResponse, Error, T>, 'queryKey' | 'queryFn'>
) {
  return useQuery<UserSitesResponse, Error, T>({
    queryKey: ['user_sites'],
    queryFn: fetchUserSites,
    ...queryOptions,
  });
}

export function useGetUserLocations<T = UserLocationsResponse>(
  queryOptions: Omit<UseQueryOptions<UserLocationsResponse, Error, T>, 'queryKey'> = {}
) {
  return useQuery({
    queryKey: userLocationsKeys.list(),
    queryFn: fetchUserLocations,
    ...queryOptions,
  });
}

const createUserLocation = async (body: UserLocationCreateBody) => {
  try {
    const r = await API.request<{ data: UserLocation }>({
      method: 'POST',
      url: '/user_locations',
      data: body,
    });

    return r.data;
  } catch (e) {
    const err = e as AxiosError<any>;

    console.error('createUserLocation ERROR', err.response?.status, err.response?.data);
    throw e;
  }
};

export function useCreateUserLocation() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body: UserLocationCreateBody) => {
      return createUserLocation(body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userLocationsKeys.list() });
    },
    onError: (err) => {
      console.error('create mutation error', err);
    },
  });

  return {
    createUserLocation: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

export function useUpdateUserLocation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<UserLocation> }) =>
      updateUserLocation(id, body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: userLocationsKeys.list() });
      qc.invalidateQueries({ queryKey: userLocationsKeys.detail(vars.id) });
    },
  });
}

export function useDeleteUserLocation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUserLocation(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: userLocationsKeys.list() });
      qc.removeQueries({ queryKey: userLocationsKeys.detail(id) });
    },
  });
}
