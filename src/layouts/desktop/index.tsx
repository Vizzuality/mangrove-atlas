import { useCallback } from 'react';

import { useMap } from 'react-map-gl';

import cn from '@/lib/classnames';

import { locationTypeAtom, locationIdAtom } from '@/store/locations';
import { printModeState } from '@/store/print-mode';

import { useAtomValue } from 'jotai';

import { useLocation } from '@/containers/datasets/locations/hooks';
import type { LocationTypes } from '@/containers/datasets/locations/types';
import WelcomeIntroMessage from '@/containers/welcome-message';
import WidgetsContainer from '@/containers/widgets';

import Logo from 'components/logo';

const DesktopLayout = () => {
  const map = useMap();

  const isPrintingMode = useAtomValue(printModeState);

  const locationType = (useAtomValue(locationTypeAtom) || 'worldwide') as LocationTypes;
  const id = useAtomValue(locationIdAtom);
  const { data: locationData } = useLocation(id, locationType);
  const location = locationData?.name;

  const handleReset = useCallback(() => {
    // `useMap()` returns a truthy MapCollection even before any <Map /> has
    // mounted; the keyed ref is what can be undefined during the async init
    // window (and forever in non-WebGL environments). Chain through the key.
    map?.['default']?.flyTo({
      center: [0, 20],
      zoom: 2,
    });
  }, [map]);

  return (
    <div className="pointer-events-none">
      <Logo
        src="/images/logo-bg.png"
        position="top-right"
        width={186}
        height={216}
        onClick={handleReset}
      />

      <div className="relative h-screen w-screen">
        {isPrintingMode && (
          <div className="print:absolute print:top-6 print:z-50 print:text-black">
            <h1
              className={cn({
                'm-auto w-screen text-center first-letter:uppercase': true,
                'text-lg': (location?.length ?? 0) < 10,
                'text-md': (location?.length ?? 0) > 10,
              })}
            >
              {location}
            </h1>

            <p className="text-center">
              Powered by Global Mangrove Watch. https://www.globalmangrovewatch.org
            </p>
          </div>
        )}

        <WidgetsContainer />

        <WelcomeIntroMessage />
      </div>
    </div>
  );
};

export default DesktopLayout;
