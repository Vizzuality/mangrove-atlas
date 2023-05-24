import { mapViewAtom } from 'store/sidebar';

import { useRecoilValue } from 'recoil';

import MapContainer from 'containers/map';
import Sidebar from 'containers/sidebar/mobile';
import WidgetsContainer from 'containers/widgets';

import Icon from 'components/icon';

import LOGO_MOBILE_SVG from 'svgs/logo-mobile.svg?sprite';

const MobileLayout = () => {
  const mapView = useRecoilValue(mapViewAtom);
  return (
    <div>
      <div className="fixed top-0 -left-0.5 z-40 h-24 w-full bg-[url('/images/mobile-header.svg')] bg-contain bg-no-repeat">
        <Icon icon={LOGO_MOBILE_SVG} className="ml-4 mt-1.5 h-10 w-24" />
      </div>
      <Sidebar />
      {mapView && <MapContainer id="default-mobile" />}
      {!mapView && <WidgetsContainer />}
    </div>
  );
};

export default MobileLayout;
