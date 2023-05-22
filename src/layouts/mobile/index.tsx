import { mapViewAtom } from 'store/sidebar';

import { useRecoilValue } from 'recoil';

import MapContainerMobile from 'containers/map/mobile';
import Sidebar from 'containers/sidebar/mobile';

const MobileLayout = () => {
  const mapView = useRecoilValue(mapViewAtom);
  return (
    <div>
      <Sidebar />
      {mapView && <MapContainerMobile />}
    </div>
  );
};

export default MobileLayout;
