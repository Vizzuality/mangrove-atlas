'use client';

import { useEffect } from 'react';

import { locationTypeAtom, locationIdAtom } from '@/store/locations';
import { printModeState } from '@/store/print-mode';

import { useSetAtom } from 'jotai';
import { useAtomValue } from 'jotai';
import { useWindowSize } from 'usehooks-ts';

import DesktopLayout from '@/layouts/desktop';
import MobileLayout from '@/layouts/mobile';

import { breakpoints } from '@/styles/styles.config';

interface MainAppProps {
  locationType: string | null;
  locationId: string | null;
}

export default function MainApp({ locationType, locationId }: MainAppProps) {
  const setLocationType = useSetAtom(locationTypeAtom);
  const setLocationId = useSetAtom(locationIdAtom);
  const isPrintingMode = useAtomValue(printModeState);

  useEffect(() => {
    setLocationType(locationType);
    setLocationId(locationId);
  }, [locationType, locationId, setLocationType, setLocationId]);

  const { width: screenWidth } = useWindowSize();

  return (
    <>
      {screenWidth >= breakpoints.md && <DesktopLayout />}
      {screenWidth < breakpoints.md && <MobileLayout />}
    </>
  );
}
