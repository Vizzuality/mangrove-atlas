import cn from 'lib/classnames';

import MapContainer from 'containers/map/component';
import Sidebar from 'containers/sidebar';

const DesktopLayout = () => {
  return (
    <div>
      <Sidebar />
      <MapContainer />
    </div>
  );
};

export default DesktopLayout;
