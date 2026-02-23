'use client';

import { useLocation } from '@/containers/datasets/locations/hooks';

import LocationItem from './item';
import {
  useCreateUserLocation,
  useGetUserLocations,
  useUpdateUserLocation,
} from '@/containers/datasets/locations/user-locations';
import { Button } from 'components/ui/button';
import { useRouter } from 'next/router';
import { LocationTypes } from '@/containers/datasets/locations/types';
import Loading from 'components/ui/loading';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';

const SavedAreasContent = () => {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const { data: location } = useLocation(id, locationType);
  const { data: locations, isLoading: isLoadingUserLocations } = useGetUserLocations();
  const existingLocation = locations?.data.find((loc) => loc.location_id === location?.id);

  const { name, id: location_id } = location || {};

  const createUserLocationMutation = useCreateUserLocation();
  const updateUserLocationMutation = useUpdateUserLocation();

  const { customGeojson } = useRecoilValue(drawingToolAtom);
  const { uploadedGeojson } = useRecoilValue(drawingUploadToolAtom);

  const buildCustomGeometry = () => {
    const drawn = customGeojson?.features?.[0]?.geometry;
    const uploaded = uploadedGeojson?.features?.[0]?.geometry;

    const geom = drawn ?? uploaded;

    if (!geom || !('coordinates' in geom) || !geom.coordinates) return null;

    return {
      description: drawn ? 'Custom drawn area' : 'Uploaded area',
      type: 'Polygon' as const,
      coordinates: geom.coordinates as [number][],
    };
  };
  const handleClickSaveArea = async () => {
    try {
      const id = existingLocation?.id;

      // 1) Custom area: send custom_geometry
      if (locationType === 'custom-area') {
        const custom_geometry = buildCustomGeometry();

        await createUserLocationMutation.createUserLocation({
          name,
          custom_geometry,
        });
      }

      // 2) Non-custom area: update if id, else create
      if (id) {
        await updateUserLocationMutation.mutateAsync({
          id,
          body: { name },
        });
        return;
      }

      await createUserLocationMutation.createUserLocation({
        name,
        location_id: location_id as number,
        custom_geometry: null, // or omit if your API allows
      });
    } catch (error) {
      console.error('Error saving location', error);
    }
  };

  const dataLocationsList = useMemo(() => locations?.data, [locations]);
  const metaLocations = useMemo(() => locations?.meta, [locations]);

  return (
    <div className="flex flex-col space-y-6 text-black/85">
      {isLoadingUserLocations && <Loading />}
      {!isLoadingUserLocations && (
        <>
          <p className="text-lg">
            You can save{' '}
            <span className="font-bold">up to {metaLocations?.max_locations} areas.</span> Select
            one to analyse.
          </p>
          <div className="flex flex-col space-y-4">
            {!!dataLocationsList?.length &&
              dataLocationsList.map(({ name, id }) => (
                <div key={name} className="mb-4">
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
        disabled={metaLocations?.current_count === 5}
        onClick={handleClickSaveArea}
      >
        Save current area
      </Button>
    </div>
  );
};

export default SavedAreasContent;
