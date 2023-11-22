import Image from 'next/image';
import Link from 'next/link';

import Helper from 'containers/guide/helper';
import Menu from 'containers/sidebar/menu';

import Category from './category';
import MapSettings from './map-settings';
import News from './news';
import Place from './place';
const HELPER_ID = 'menu-categories';

const Sidebar = () => (
  <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-full bg-[url('/images/sidebar-bg.png')] bg-[top_left_-16px] bg-no-repeat print:hidden">
    <Link
      href="/"
      className="pointer-events-auto absolute top-0 left-0 z-50 h-[90px] w-[220px] cursor-pointer print:hidden"
      data-testid="desktop-logo-link"
    >
      <Image width={220} height={100} src="/images/logo.svg" alt="Global Mangrove Watch" />
    </Link>
    <div className="pointer-events-auto relative top-28 inline-flex h-full w-18 flex-col items-start space-y-5 bg-brand-600 pl-2.5">
      <div>
        <Menu />
      </div>
      {process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' && <News />}
      <MapSettings />
      <Place />
      <Helper
        className={{
          button: HELPER_ID ? '-bottom-10 -right-1.5 z-[20]' : 'hidden',
          tooltip: 'w-fit-content',
        }}
        tooltipPosition={{ top: -40, left: -50 }}
        message="Widgets display information and statistics about a geometry on the map. Most widgets also come with map layer that can be toggled on or off"
      >
        <Category />
      </Helper>
    </div>
  </div>
);

export default Sidebar;
