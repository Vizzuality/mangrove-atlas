'use client';

import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { useLocation } from '@/containers/datasets/locations/hooks';
import { LocationTypes } from '@/containers/datasets/locations/types';
import { useGetUserLocations } from '@/containers/datasets/locations/user-locations';

import Loading from 'components/ui/loading';

import LocationItem from './item';
import LocationItemNew from './item-new';

const SavedAreasContent = () => {
  const {
    query: { params: queryParams },
  } = useRouter();

  const locationType = queryParams?.[0] as LocationTypes | undefined;
  const routeId = queryParams?.[1];

  const { data: location } = useLocation(routeId, locationType);
  const { data: userLocationsRes, isLoading: isLoadingUserLocations } = useGetUserLocations();

  const userLocations = userLocationsRes?.data ?? [];
  const meta = userLocationsRes?.meta;

  const routeName = location?.name ?? '';
  const routeLocationId = location?.id;

  const existsInSaved = useMemo(() => {
    if (typeof routeLocationId !== 'number') return false;
    return userLocations.some((ul) => ul.location?.id === routeLocationId);
  }, [userLocations, routeLocationId]);

  const shouldShowNew =
    locationType === 'custom-area' || (typeof routeLocationId === 'number' && !existsInSaved);

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
            {userLocations.map((ul) => (
              <LocationItem
                key={ul.id}
                userLocationId={ul.id}
                name={ul.name}
                locationType={ul.location_type}
              />
            ))}

            {shouldShowNew && (
              <LocationItemNew
                key={`new-${locationType}-${routeLocationId ?? 'custom'}`}
                name={routeName}
                // for system routes this is the system location id; for custom-area it can be undefined
                systemLocationId={typeof routeLocationId === 'number' ? routeLocationId : undefined}
                locationType={locationType}
                disabled={Boolean(meta && meta.current_count >= meta.max_locations)}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SavedAreasContent;
