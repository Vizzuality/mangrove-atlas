import Image from 'next/image';
import Link from 'next/link';

import { mapViewAtom } from 'store/sidebar';

import { useRecoilValue } from 'recoil';

import MapContainer from 'containers/map';
import NavigationBar from 'containers/navigation/mobile';
import WidgetsContainer from 'containers/widgets';

import Icon from 'components/ui/icon';

import LOGO_MOBILE_SVG from 'svgs/logo-mobile.svg?sprite';

const MobileLayout = () => {
  const mapView = useRecoilValue(mapViewAtom);
  return (
    <div className="h-screen print:bg-transparent">
      <Link className="fixed -top-1 left-0 z-10" href="/">
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
      {mapView && <MapContainer mapId="default-mobile" />}
      {!mapView && <WidgetsContainer />}
    </div>
  );
};

export default MobileLayout;
