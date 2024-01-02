import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { fullScreenAtom } from 'store/map-settings';
import { printModeState } from 'store/print-mode';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';
import MapContainer from 'containers/map';
import WidgetsContainer from 'containers/widgets';

import LOGO_PNG from 'images/logo-bg.png';

const DesktopLayout = () => {
  const isPrintingMode = useRecoilValue(printModeState);
  const isFullScreen = useRecoilValue(fullScreenAtom);

  const isPrintingId = isPrintingMode ? 'print-mode' : 'no-print';
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];

  const {
    data: { name: location },
  } = useLocation(locationType, id);

  return (
    <div className="overflow-hidden print:overflow-visible">
      <Image
        src={LOGO_PNG as StaticImageData}
        alt="Logo Global Mangrove Watch"
        className="absolute top-0 right-0 z-10"
        width={186}
        height={216}
      />

      <div className="relative h-screen w-screen">
        {isPrintingMode && (
          <h1
            className={cn({
              'm-auto w-screen text-center first-letter:uppercase': true,
              'text-lg': location.length < 10,
              'text-md': location.length > 10,
            })}
          >
            {location}
          </h1>
        )}

        {isPrintingMode && (
          <p className="text-center">
            Powered by Global Mangrove Watch. https://www.globalmangrovewatch.org
          </p>
        )}
        <MapContainer mapId={`default-desktop-${isPrintingId}`} />
        {!isFullScreen && <WidgetsContainer />}
      </div>
    </div>
  );
};

export default DesktopLayout;
