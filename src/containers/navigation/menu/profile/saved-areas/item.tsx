'use client';

import { useCallback, useMemo, useState } from 'react';

import cn from '@/lib/classnames';

import { analysisAtom } from '@/store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';

import turfBbox from '@turf/bbox';
import bbox from '@turf/bbox';
import type { Feature, FeatureCollection, Polygon, MultiPolygon, Geometry } from 'geojson';
import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { LuPencil, LuCheck } from 'react-icons/lu';

import { useLocationNavigation, locationToNavTarget } from 'hooks/location-navigation';

import type { Location } from '@/containers/datasets/locations/types';
import {
  useDeleteUserLocation,
  useGetUserLocations,
  useUpdateUserLocation,
  UserLocationType,
  CustomGeometry,
} from '@/containers/datasets/locations/user-locations';
import {
  useGetUserNotificationPreferences,
  usePostToggleLocationAlerts,
} from '@/containers/subscriptions/hooks';

import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import CLOSE_SVG from '@/svgs/ui/close';

type BBox = [number, number, number, number];

function customGeometryToFeature(custom_geometry: { coordinates: any }): Feature | null {
  const coords = custom_geometry?.coordinates;
  if (!coords) return null;

  // Heurística:
  // Polygon => coordinates[0] es un array de puntos [lng,lat]
  // MultiPolygon => coordinates[0][0] es un array de puntos [lng,lat]
  const isMultiPolygon =
    Array.isArray(coords) &&
    Array.isArray(coords[0]) &&
    Array.isArray(coords[0][0]) &&
    Array.isArray(coords[0][0][0]);

  const geometry: Geometry = isMultiPolygon
    ? ({ type: 'MultiPolygon', coordinates: coords } as MultiPolygon)
    : ({ type: 'Polygon', coordinates: coords } as Polygon);

  return {
    type: 'Feature',
    properties: {},
    geometry,
  };
}

function customGeometryToBBox(custom_geometry: { coordinates: any }): BBox | null {
  const feature = customGeometryToFeature(custom_geometry);
  if (!feature) return null;
  return bbox(feature) as BBox;
}

function customGeometryToFeatureCollection(custom_geometry: {
  coordinates: any;
}): FeatureCollection | null {
  const feature = customGeometryToFeature(custom_geometry);
  if (!feature) return null;
  return { type: 'FeatureCollection', features: [feature] };
}

const LuPencilIcon = LuPencil as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;
const LuCheckIcon = LuCheck as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;

type Props = {
  userLocationId: number;
  name: string;
  locationType: UserLocationType;
  location?: Location | null;
  geometry?: CustomGeometry;
};

const LocationItem = ({ userLocationId, name, locationType, location, geometry }: Props) => {
  const [isEditMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(name);
  const { navigate } = useLocationNavigation();

  const setDrawingUploadToolState = useSetAtom(drawingUploadToolAtom);
  const resetDrawingUploadToolState = useResetAtom(drawingUploadToolAtom);
  const resetDrawingToolState = useResetAtom(drawingToolAtom);
  const setAnalysisState = useSetAtom(analysisAtom);
  const resetAnalysisState = useResetAtom(analysisAtom);

  const deleteUserLocationArea = useDeleteUserLocation();
  const updateUserLocationMutation = useUpdateUserLocation();
  const toggleMutation = usePostToggleLocationAlerts();

  const { data: dataUserNotificationsPreferences } = useGetUserNotificationPreferences();
  const { data: userLocationsRes } = useGetUserLocations();

  const isDeleting = deleteUserLocationArea.isPending;

  const remainingCountAfterDelete = useMemo(() => {
    const current = userLocationsRes?.data?.length ?? 0;
    return Math.max(0, current - 1);
  }, [userLocationsRes?.data?.length]);

  const handleEditMode = useCallback(() => {
    setEditMode((prev) => {
      if (prev) setNewName(name);
      return !prev;
    });
  }, [name]);

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

  const bounds = useMemo(() => {
    if (!location?.bounds) return null;
    return turfBbox(location?.bounds) as [number, number, number, number];
  }, [location?.bounds]);

  const customBounds = useMemo(() => {
    if (!geometry) return null;
    return customGeometryToBBox(geometry);
  }, [geometry]);

  const customFeatureCollection = useMemo(() => {
    if (!geometry) return null;
    return customGeometryToFeatureCollection(geometry);
  }, [geometry]);

  const handleLocationClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (locationType === 'system' && location) {
        // Leaving any active custom-area analysis when jumping to a system area.
        resetDrawingToolState();
        resetDrawingUploadToolState();
        resetAnalysisState();
        navigate(locationToNavTarget(location), bounds);
      } else if (locationType === 'custom' && customFeatureCollection) {
        // Feed the saved geometry into the drawing-tool pipeline so it renders
        // via mapbox-gl-draw and reroutes the widgets/data hooks to the
        // analysis API — same state as a freshly drawn/uploaded area.
        resetDrawingToolState();
        setDrawingUploadToolState((prev) => ({
          ...prev,
          uploadedGeojson: customFeatureCollection,
          customGeojson: null,
        }));
        setAnalysisState((prev) => ({ ...prev, enabled: true }));
        navigate({ type: 'custom-area' }, customBounds);
      }
    },
    [
      navigate,
      bounds,
      customBounds,
      customFeatureCollection,
      location,
      locationType,
      resetDrawingToolState,
      resetDrawingUploadToolState,
      resetAnalysisState,
      setDrawingUploadToolState,
      setAnalysisState,
    ]
  );

  return (
    <li className="flex items-center justify-between gap-3">
      {(locationType === 'system' || (locationType === 'custom' && !isEditMode)) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={`Navigate to ${name}`}
              className="focus-visible:ring-brand-500 underline-offset-2 first-letter:uppercase focus-visible:ring-2 focus-visible:outline-none"
              onClick={handleLocationClick}
            >
              {name}
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-700 px-2 text-white">
            {locationType === 'system'
              ? 'Click to fly to this location.'
              : 'Click to view this custom location on the map.'}
          </TooltipContent>
        </Tooltip>
      )}

      {locationType === 'custom' && isEditMode && (
        <Input
          type="text"
          aria-label={`Rename location ${name}`}
          value={newName}
          onChange={handleNewName}
        />
      )}

      <div className="flex space-x-2">
        {locationType === 'custom' && !isEditMode && (
          <button
            type="button"
            aria-label={`Edit location ${name}`}
            disabled={isDeleting}
            onClick={handleEditMode}
            className={cn(
              'border-brand-800/20 text-brand-800 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-2',
              isDeleting && 'cursor-not-allowed opacity-60'
            )}
          >
            <LuPencilIcon aria-hidden="true" className="h-4 w-4 shrink-0 stroke-2" />
          </button>
        )}

        {locationType === 'custom' && isEditMode && newName !== name && (
          <button
            type="button"
            aria-label={`Save location ${name}`}
            disabled={isDeleting || !newName.trim()}
            onClick={handleSaveName}
            className={cn(
              'border-brand-800/20 text-brand-800 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-2',
              (isDeleting || !newName.trim()) && 'cursor-not-allowed opacity-60'
            )}
          >
            <LuCheckIcon aria-hidden="true" className="h-4 w-4 stroke-2" />
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
              'border-brand-800/20 text-brand-800 flex shrink-0 items-center justify-center rounded-full border-2 p-[5px]',
              isDeleting && 'cursor-not-allowed opacity-60'
            )}
          >
            <CLOSE_SVG className="h-4 w-4 shrink-0 fill-current" aria-hidden="true" />
          </button>
        )}
      </div>
    </li>
  );
};

export default LocationItem;
