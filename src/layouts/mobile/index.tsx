import { useCallback } from 'react';

import { useMap } from 'react-map-gl';

import Image from 'next/image';
import Link from 'next/link';

import { mapViewAtom } from '@/store/sidebar';

import { useAtomValue } from 'jotai';

import MapContainer from '@/containers/map';
import NavigationBar from '@/containers/navigation/mobile';
import WelcomeIntroMessage from '@/containers/welcome-message';
import WidgetsContainer from '@/containers/widgets';

import LOGO_MOBILE_SVG from '@/svgs/logo-mobile';

const MobileLayout = () => {
  const mapView = useAtomValue(mapViewAtom);
  const map = useMap();

  const handleReset = useCallback(() => {
    // See desktop layout: chain through the keyed ref, not just `map`.
    map?.['default-mobile-no-print']?.flyTo({
      center: [0, 20],
      zoom: 2,
    });
  }, [map]);

  return (
    <div className="h-screen print:bg-transparent">
      <Link className="fixed -top-1 left-0 z-10" href="/" onClick={handleReset}>
        <Image
          src="/images/mobile-header.svg"
          alt="Picture of the author"
          width={100}
          height={100}
          className="h-[72px] w-[330px]"
        />
        <LOGO_MOBILE_SVG
          className="absolute top-2 left-4 z-50 h-8 w-20 fill-current"
          role="img"
          title="Logo"
        />
      </Link>
      <NavigationBar />
      <WelcomeIntroMessage />
      {mapView && <MapContainer mapId="default-mobile" />}
      {!mapView && <WidgetsContainer />}
    </div>
  );
};

export default MobileLayout;
