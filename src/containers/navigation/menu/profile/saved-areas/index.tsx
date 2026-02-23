'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';

import { useLocation } from '@/containers/datasets/locations/hooks';
import { LocationTypes } from '@/containers/datasets/locations/types';
import {
  useCreateUserLocation,
  useGetUserLocations,
  useUpdateUserLocation,
} from '@/containers/datasets/locations/user-locations';

import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';

import LocationItem from './item';
import Loading from 'components/ui/loading';
import { Button } from 'components/ui/button';

type CustomGeometry = {
  description: string;
  type: 'Polygon';
  coordinates: GeoJSON.Polygon['coordinates'];
};

const SavedAreasContent = () => {
  const {
    query: { params: queryParams },
  } = useRouter();

  const locationType = queryParams?.[0] as LocationTypes | undefined;
  const routeId = queryParams?.[1];

  const { data: location } = useLocation(routeId, locationType);
  const { data: userLocationsRes, isLoading: isLoadingUserLocations } = useGetUserLocations();

  const createUserLocationMutation = useCreateUserLocation();
  const updateUserLocationMutation = useUpdateUserLocation();

  const { customGeojson } = useRecoilValue(drawingToolAtom);
  const { uploadedGeojson } = useRecoilValue(drawingUploadToolAtom);

  const userLocations = userLocationsRes?.data ?? [];
  const meta = userLocationsRes?.meta;

  const existingLocation = useMemo(() => {
    const locId = location?.id;
    if (!locId) return undefined;
    return userLocations.find((ul) => ul.location_id === locId);
  }, [userLocations, location?.id]);

  const name = location?.name ?? '';
  const location_id = location?.id;

  const buildCustomGeometry = useCallback((): CustomGeometry | null => {
    const drawn = customGeojson?.features?.[0]?.geometry;
    const uploaded = uploadedGeojson?.features?.[0]?.geometry;

    const geom = drawn ?? uploaded;
    if (!geom || geom.type !== 'Polygon' || !('coordinates' in geom) || !geom.coordinates)
      return null;

    return {
      description: drawn ? 'Custom drawn area' : 'Uploaded area',
      type: 'Polygon',
      coordinates: (geom as GeoJSON.Polygon).coordinates,
    };
  }, [customGeojson, uploadedGeojson]);

  const handleClickSaveArea = useCallback(async () => {
    try {
      if (!name) return;

      // Update existing saved location name
      if (existingLocation?.id) {
        await updateUserLocationMutation.mutateAsync({
          id: existingLocation.id,
          body: { name },
        });
        return;
      }

      // Create custom area
      if (locationType === 'custom-area') {
        const custom_geometry = buildCustomGeometry();
        if (!custom_geometry) {
          console.warn('No custom geometry available to save.');
          return;
        }

        await createUserLocationMutation.createUserLocation({ name, custom_geometry });
        return;
      }

      // Create non-custom area
      if (typeof location_id !== 'number') {
        console.warn('No location_id available to save.');
        return;
      }

      await createUserLocationMutation.createUserLocation({
        name,
        location_id,
      });
    } catch (error) {
      console.error('Error saving location', error);
    }
  }, [
    name,
    existingLocation?.id,
    locationType,
    location_id,
    buildCustomGeometry,
    createUserLocationMutation,
    updateUserLocationMutation,
  ]);

  const isSaveDisabled = (meta?.current_count ?? 0) >= (meta?.max_locations ?? 5);

  return (
    <div className="flex flex-col space-y-6 text-black/85">
      {isLoadingUserLocations ? (
        <Loading />
      ) : (
        <>
          <p className="text-lg">
            You can save <span className="font-bold">up to {meta?.max_locations} areas.</span>{' '}
            Select one to analyse.
          </p>

          <div className="flex flex-col space-y-4">
            {userLocations.map(({ name, id }) => (
              <div key={id} className="mb-4">
                <LocationItem name={name} id={id} />
              </div>
            ))}
          </div>
        </>
      )}

      <Button
        className="w-fit"
        variant="secondary"
        size="lg"
        disabled={isSaveDisabled}
        onClick={handleClickSaveArea}
      >
        Save current area
      </Button>
    </div>
  );
};

export default SavedAreasContent;
