'use client';

import { useCallback } from 'react';
import { LuX } from 'react-icons/lu';

import {
  useDeleteUserLocation,
  useGetUserLocations,
} from '@/containers/datasets/locations/user-locations';
import cn from '@/lib/classnames';
import {
  useGetUserNotificationPreferences,
  usePostToggleLocationAlerts,
} from '@/containers/subscriptions/hooks';

const LuXIcon = LuX as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;

type Props = { name: string; id: number };

const LocationItem = ({ name, id }: Props) => {
  const deleteUserLocationArea = useDeleteUserLocation();
  const { data: dataUserNotificationsPreferences } = useGetUserNotificationPreferences();
  const { data: dataUserLocation, isFetched: isFetchedUserLocations } = useGetUserLocations();
  const { isLoading: isDeleting, isSuccess } = deleteUserLocationArea;
  const toggleMutation = usePostToggleLocationAlerts();

  const handleClick = useCallback(async () => {
    try {
      await deleteUserLocationArea.mutateAsync(id);
      if (isSuccess && isFetchedUserLocations && dataUserLocation.data.length === 0) {
        if (dataUserNotificationsPreferences) {
          toggleMutation.mutate({
            ...dataUserNotificationsPreferences.data,
            location_alerts: false,
          });
        }
      }
    } catch (error) {
      console.error('Error deleting location', error);
    }
  }, [
    deleteUserLocationArea,
    id,
    dataUserNotificationsPreferences,
    isFetchedUserLocations,
    dataUserLocation,
    toggleMutation,
  ]);

  return (
    <li className="flex items-center justify-between gap-3">
      <span
        className={cn('first-letter:uppercase', name === 'worldwide' && 'text-brand-800 font-bold')}
      >
        {name}
      </span>

      <button
        type="button"
        aria-label={`Delete location ${name}`}
        disabled={isDeleting}
        onClick={handleClick}
        className={cn(
          'border-brand/80 text-brand-800 flex shrink-0 items-center justify-center rounded-full border-2 p-1',
          isDeleting && 'cursor-not-allowed opacity-60'
        )}
      >
        <LuXIcon className="h-5 w-5 cursor-pointer stroke-2" />
      </button>
    </li>
  );
};

export default LocationItem;
