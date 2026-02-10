import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';

import API from 'services/api';

export type DataUserNotificationPreferencesToggleLocationAlerts = {
  location_alerts: boolean;
  platform_updates: boolean;
  newsletter: boolean;
};

export type UserNotificationPreferencesResponse = {
  data: DataUserNotificationPreferencesToggleLocationAlerts;
  isPending: boolean;
};

// ---------------------
// Fetchers
// ---------------------

export const fetchUserNotificationPreferences = () =>
  API.request<UserNotificationPreferencesResponse>({
    method: 'GET',
    url: '/notification_preferences',
  }).then((r) => r.data);

export const postToggleLocationAlerts = (
  body: DataUserNotificationPreferencesToggleLocationAlerts
) =>
  API.request<DataUserNotificationPreferencesToggleLocationAlerts>({
    method: 'POST',
    url: '/notification_preferences/toggle_location_alerts',
    data: body,
  }).then((r) => {
    return r.data;
  });

// ---------------------
// Keys
// ---------------------

export const notificationPreferencesKeys = {
  all: ['notification_preferences'] as const,
  list: () => [...notificationPreferencesKeys.all, 'list'] as const,
  toggleLocationAlerts: () =>
    [...notificationPreferencesKeys.all, 'toggle-location-alerts'] as const,
};

// ---------------------
// Hooks
// ---------------------

export function useGetUserNotificationPreferences<T = UserNotificationPreferencesResponse>(
  queryOptions: UseQueryOptions<UserNotificationPreferencesResponse, Error, T> = {}
) {
  return useQuery(notificationPreferencesKeys.list(), fetchUserNotificationPreferences, {
    ...queryOptions,
  });
}

export function usePostToggleLocationAlerts() {
  const qc = useQueryClient();

  return useMutation(
    (body: { location_alerts: boolean; newsletter: boolean; platform_updates: boolean }) =>
      postToggleLocationAlerts(body),

    {
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: notificationPreferencesKeys.list(),
        });
      },
      onError: (error) => {
        console.error('Error toggling location alerts:', error);
      },
    }
  );
}
