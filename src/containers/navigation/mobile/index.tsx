import Locations from 'containers/navigation/mobile/locations';
import MapToggle from 'containers/navigation/mobile/map-toggle';

import ConfigureWidgets from './configure';

const NavigationMobile = () => {
  return (
    <div className="fixed -bottom-0.5 z-50 h-36 w-full bg-[url('/images/mobile-sidebar-bg.svg')] bg-cover bg-no-repeat">
      <div className="item-center px-auto mt-20 flex h-full w-full justify-center space-x-10">
        <Locations />
        <ConfigureWidgets />

        <MapToggle />
      </div>
    </div>
  );
};

export default NavigationMobile;
