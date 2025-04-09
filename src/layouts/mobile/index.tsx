import { useCallback } from 'react';

import { useMap } from 'react-map-gl';

import Image from 'next/image';
import Link from 'next/link';

import { mapViewAtom } from 'store/sidebar';

import { useRecoilValue } from 'recoil';

import MapContainer from 'containers/map';
import NavigationBar from 'containers/navigation/mobile';
import WelcomeIntroMessage from 'containers/welcome-message';
import WidgetsContainer from 'containers/widgets';

import Icon from 'components/ui/icon';

import LOGO_MOBILE_SVG from 'svgs/logo-mobile.svg?sprite';

const MobileLayout = () => {
  const mapView = useRecoilValue(mapViewAtom);
  const map = useMap();

  const handleReset = useCallback(() => {
    if (map) {
      map?.['default-desktop-no-print'].flyTo({
        center: [0, 20],
        zoom: 2,
      });
    }
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
        <Icon
          icon={LOGO_MOBILE_SVG}
          className="absolute top-2 left-4 z-50 h-8 w-20"
          description="Logo"
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
