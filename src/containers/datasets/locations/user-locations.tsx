import API from 'services/api';
import { useQuery, UseQueryOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import type { Location, LocationTypes } from './types';

export interface UserLocation extends Location {
  user_id: string;
}

export type UserLocationsResponse = {
  data: UserLocation[];
  metadata?: unknown;
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

export const createUserLocation = (body: Partial<UserLocation>) =>
  API.request<{ data: UserLocation }>({
    method: 'POST',
    url: '/user_locations',
    data: body,
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

export function useCreateUserLocation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: Partial<UserLocation>) => createUserLocation(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userLocationsKeys.list() });
    },
  });
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
