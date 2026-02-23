import API from 'services/api';
import { useQuery, UseQueryOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import type { AxiosError } from 'axios';
import type { Location } from './types';

export interface UserLocation extends Location {
  user_id: string;
}

type MetadataUserLocation = {
  max_locations: number;
  current_count: number;
};

export type UserLocationsResponse = {
  data: UserLocation[];
  meta: MetadataUserLocation;
};

type UserLocationCreateBody = {
  // Display name for the saved location
  name: string;
  // ID of a system location. Mutually exclusive with custom_geometry
  location_id?: number;

  // GeoJSON geometry object. Mutually exclusive with location_id
  custom_geometry?: {
    description: string;
    type: 'Polygon';
    coordinates: [number][];
  };
  // Map viewport bounds for the location
  bounds?: {
    description: string;

    north: number;
    south: number;
    east: number;
    west: number;
  };
  // Display order position
  position?: number;

  // Whether location-based alerts are enabled for this location. Defaults to true
  alerts_enabled?: boolean;
};

export const fetchUserLocations = () =>
  API.request<UserLocationsResponse>({
    method: 'GET',
    url: '/user_locations',
  }).then((r) => r.data);

export const fetchUserLocation = (id: UserLocation['id']) =>
  API.request<{ data: UserLocation }>({
    method: 'GET',
    url: `/user_locations/${id}`,
  }).then((r) => r.data);

export const updateUserLocation = (id: UserLocation['id'], body: Partial<UserLocation>) =>
  API.request<{ data: UserLocation }>({
    method: 'PATCH',
    url: `/user_locations/${id}`,
    data: body,
  }).then((r) => r.data);

export const deleteUserLocation = (id: UserLocation['id']) =>
  API.request<void>({
    method: 'DELETE',
    url: `/user_locations/${id}`,
  }).then((r) => r.data);

export const userLocationsKeys = {
  all: ['user_locations'] as const,
  list: () => [...userLocationsKeys.all, 'list'] as const,
  detail: (id: number) => [...userLocationsKeys.all, 'detail', id] as const,
};

export function useGetUserLocations<T = UserLocationsResponse>(
  queryOptions: UseQueryOptions<UserLocationsResponse, Error, T> = {}
) {
  return useQuery(userLocationsKeys.list(), fetchUserLocations, {
    ...queryOptions,
  });
}

export function useGetUserLocation(
  id?: UserLocation['id'],
  queryOptions: UseQueryOptions<{ data: UserLocation }, Error, UserLocation> = {}
) {
  return useQuery(userLocationsKeys.detail(id), () => fetchUserLocation(id!), {
    enabled: Boolean(id),
    select: ({ data }) => data,
    ...queryOptions,
  });
}

export const createUserLocation = async (body: UserLocationCreateBody) => {
  try {
    console.log('createUserLocation called');
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
    isLoading: mutation.isLoading,
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
