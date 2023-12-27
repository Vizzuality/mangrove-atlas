import Menu from 'containers/navigation/menu';
import MapToggle from 'containers/sidebar/mobile/map-toggle';

import PlacesMobile from './places';

const SidebarMobile = () => {
  return (
    <div className="fixed -bottom-0.5 z-50 h-36 w-full bg-[url('/images/mobile-sidebar-bg.svg')] bg-cover bg-no-repeat">
      <div className="item-center px-auto mt-20 flex h-full w-full justify-center space-x-10">
        <Menu />
        <PlacesMobile />
        <MapToggle />
      </div>
    </div>
  );
};

export default SidebarMobile;
