'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { LuX, LuPencil, LuCheck } from 'react-icons/lu';

import cn from '@/lib/classnames';
import { Input } from '@/components/ui/input';

import {
  useDeleteUserLocation,
  useGetUserLocations,
  useUpdateUserLocation,
  UserLocationType,
} from '@/containers/datasets/locations/user-locations';
import {
  useGetUserNotificationPreferences,
  usePostToggleLocationAlerts,
} from '@/containers/subscriptions/hooks';

const LuXIcon = LuX as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;
const LuPencilIcon = LuPencil as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;
const LuCheckIcon = LuCheck as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;

type Props = {
  userLocationId: number;
  name: string;
  locationType: UserLocationType;
};

const LocationItem = ({ userLocationId, name, locationType }: Props) => {
  const [isEditMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(name);

  useEffect(() => {
    if (!isEditMode) setNewName(name);
  }, [name, isEditMode]);

  const deleteUserLocationArea = useDeleteUserLocation();
  const updateUserLocationMutation = useUpdateUserLocation();
  const toggleMutation = usePostToggleLocationAlerts();

  const { data: dataUserNotificationsPreferences } = useGetUserNotificationPreferences();
  const { data: userLocationsRes } = useGetUserLocations();

  const isDeleting = deleteUserLocationArea.isLoading;

  const remainingCountAfterDelete = useMemo(() => {
    const current = userLocationsRes?.data?.length ?? 0;
    return Math.max(0, current - 1);
  }, [userLocationsRes?.data?.length]);

  const handleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
  }, []);

  const handleNewName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.currentTarget.value);
  }, []);

  const handleSaveName = useCallback(async () => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === name) {
      setEditMode(false);
      return;
    }

    try {
      await updateUserLocationMutation.mutateAsync({
        id: userLocationId,
        body: { name: trimmed },
      });
      setEditMode(false);
    } catch (error) {
      console.error('Error updating location name', error);
    }
  }, [newName, name, updateUserLocationMutation, userLocationId]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteUserLocationArea.mutateAsync(userLocationId);

      if (remainingCountAfterDelete === 0 && dataUserNotificationsPreferences?.data) {
        toggleMutation.mutate({
          ...dataUserNotificationsPreferences.data,
          location_alerts: false,
        });
      }
    } catch (error) {
      console.error('Error deleting location', error);
    }
  }, [
    deleteUserLocationArea,
    userLocationId,
    remainingCountAfterDelete,
    dataUserNotificationsPreferences,
    toggleMutation,
  ]);

  return (
    <li className="flex items-center justify-between gap-3">
      {locationType === 'system' && <span className="first-letter:uppercase">{name}</span>}

      {locationType === 'custom' && !isEditMode && (
        <span className="first-letter:uppercase">{name}</span>
      )}

      {locationType === 'custom' && isEditMode && (
        <Input type="text" value={newName} onChange={handleNewName} />
      )}

      <div className="flex space-x-2">
        {locationType === 'custom' && !isEditMode && (
          <button
            type="button"
            aria-label={`Edit location ${name}`}
            disabled={isDeleting}
            onClick={handleEditMode}
            className={cn(
              'border-brand/80 text-brand-800 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-2',
              isDeleting && 'cursor-not-allowed opacity-60'
            )}
          >
            <LuPencilIcon className="h-4 w-4 shrink-0 stroke-2" />
          </button>
        )}

        {locationType === 'custom' && isEditMode && newName !== name && (
          <button
            type="button"
            aria-label={`Save location ${name}`}
            disabled={isDeleting || !newName.trim()}
            onClick={handleSaveName}
            className={cn(
              'border-brand/80 text-brand-800 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-2',
              (isDeleting || !newName.trim()) && 'cursor-not-allowed opacity-60'
            )}
          >
            <LuCheckIcon className="h-4 w-4 stroke-2" />
          </button>
        )}

        {(locationType === 'system' ||
          (locationType === 'custom' && (!isEditMode || newName === name))) && (
          <button
            type="button"
            aria-label={`Delete location ${name}`}
            disabled={isDeleting}
            onClick={handleDelete}
            className={cn(
              'border-brand/80 text-brand-800 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-2',
              isDeleting && 'cursor-not-allowed opacity-60'
            )}
          >
            <LuXIcon className="h-4 w-4 stroke-2" />
          </button>
        )}
      </div>
    </li>
  );
};

export default LocationItem;
