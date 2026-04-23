'use client';

import { Suspense, useEffect } from 'react';

import { locationIdAtom, locationTypeAtom } from '@/store/locations';

import { useSetAtom } from 'jotai';

import EmbeddedMap from '@/containers/embedded/map';

interface EmbeddedWrapperProps {
  locationType: string | null;
  locationId: string | null;
}

export default function EmbeddedWrapper({ locationType, locationId }: EmbeddedWrapperProps) {
  const setLocationType = useSetAtom(locationTypeAtom);
  const setLocationId = useSetAtom(locationIdAtom);

  useEffect(() => {
    setLocationType(locationType);
    setLocationId(locationId);
  }, [locationType, locationId, setLocationType, setLocationId]);

  return (
    <Suspense>
      <EmbeddedMap mapId="embedded" />
    </Suspense>
  );
}
