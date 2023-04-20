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
