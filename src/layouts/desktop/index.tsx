import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { printModeState } from 'store/print-mode';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';
import MapContainer from 'containers/map';
import Sidebar from 'containers/sidebar';
import TranslateScripts from 'containers/translate-scripts';
import WidgetsContainer from 'containers/widgets';

const DesktopLayout = () => {
  const isPrintingMode = useRecoilValue(printModeState);

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
      <Head>
        <title>Global Mangrove Watch</title>
        <meta name="description" content="" />

        <meta name="og:title" content="Global Mangrove Watch" />
        <meta name="og:description" content="" />
        <meta name="og:type" content="website" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      <div className="print:hidden">
        <TranslateScripts />
      </div>

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
        <div className="absolute top-0 left-0 z-10 print:hidden">
          <Image width={220} height={100} src="/images/logo.svg" alt="Global Mangrove Watch" />
        </div>
        <MapContainer mapId={`default-desktop-${isPrintingId}`} />
        <Sidebar />
        <WidgetsContainer />
      </div>
    </div>
  );
};

export default DesktopLayout;
