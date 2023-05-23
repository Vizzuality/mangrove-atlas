import dynamic from 'next/dynamic';

import Menu from 'containers/sidebar/menu';
import CategoryMobile from 'containers/sidebar/mobile/category';
import MapToggle from 'containers/sidebar/mobile/map-toggle';

const PlacesMobile = dynamic(() => import('../../../containers/sidebar/mobile/places'), {
  ssr: false,
});

const Sidebar = () => {
  return (
    <div className="fixed -bottom-0.5 z-50 h-36 w-full bg-[url('/images/mobile-sidebar-bg.svg')] bg-cover bg-no-repeat sm:h-44">
      <div className="item-center px-auto mt-20 flex h-full w-full justify-center space-x-10 sm:mt-28">
        <Menu />
        <CategoryMobile />
        <PlacesMobile />
        <MapToggle />
      </div>
    </div>
  );
};

export default Sidebar;
