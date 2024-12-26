import { useCallback } from 'react';

import { useMap } from 'react-map-gl';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { cn } from 'lib/classnames';

import { printModeState } from 'store/print-mode';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';
import MapContainer from 'containers/map';
import WidgetsContainer from 'containers/widgets';

const DesktopLayout = () => {
  const map = useMap();

  const isPrintingMode = useRecoilValue(printModeState);

  const isPrintingId = isPrintingMode ? 'print-mode' : 'no-print';
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];

  const {
    data: { name: location },
  } = useLocation(id, locationType);

  const handleReset = useCallback(() => {
    if (map) {
      map?.['default-desktop-no-print'].flyTo({
        center: [0, 20],
        zoom: 2,
      });
    }
  }, [map]);

  return (
    <div className="overflow-hidden print:overflow-visible">
      <Link
        href="/"
        className="pointer-events-auto fixed top-0 right-0 z-[800]"
        draggable={false}
        onClick={handleReset}
      >
        <Image
          src="/images/logo-bg.png"
          alt="Logo Global Mangrove Watch"
          width={186}
          height={216}
          draggable={false}
          priority={true}
        />
      </Link>
      <div className="relative h-screen w-screen">
        {isPrintingMode && (
          <div className="print:absolute print:top-6 print:z-50 print:text-black">
            <h1
              className={cn({
                'm-auto w-screen text-center first-letter:uppercase': true,
                'text-lg': location.length < 10,
                'text-md': location.length > 10,
              })}
            >
              {location}
            </h1>

            <p className="text-center">
              Powered by Global Mangrove Watch. https://www.globalmangrovewatch.org
            </p>
          </div>
        )}
        <MapContainer mapId={`default-desktop-${isPrintingId}`} />
        <WidgetsContainer />
      </div>
    </div>
  );
};

export default DesktopLayout;
