import { mapViewAtom } from 'store/sidebar';

import { useRecoilValue } from 'recoil';

import MapContainer from 'containers/map';
import MetaTags from 'containers/meta-tags';
import Sidebar from 'containers/sidebar/mobile';
import WidgetsContainer from 'containers/widgets';

import Icon from 'components/icon';

import LOGO_MOBILE_SVG from 'svgs/logo-mobile.svg?sprite';

const MobileLayout = () => {
  const mapView = useRecoilValue(mapViewAtom);
  return (
    <div className="h-screen print:bg-transparent">
      <MetaTags
        title="Global Mangrove Watch - Mobile"
        description="Global Mangrove Watch (GMW) is an online platform (mobile version) that provides the remote sensing data and tools for monitoring mangroves necessary for this. It gives universal access to near real-time information on where and what changes there are to mangroves across the world, and highlights why they are valuable."
      />
      <div className="fixed top-0 -left-0.5 z-40 h-24 w-full bg-[url('/images/mobile-header.svg')] bg-contain bg-no-repeat">
        <Icon icon={LOGO_MOBILE_SVG} className="ml-4 mt-1.5 h-10 w-24" />
      </div>
      <Sidebar />
      {mapView && <MapContainer mapId="default-mobile" />}
      {!mapView && <WidgetsContainer />}
    </div>
  );
};

export default MobileLayout;
