import Image from 'next/image';
import Link from 'next/link';

import Menu from 'containers/sidebar/menu';

import MapSettings from './map-settings';
import News from './news';
import Place from './place';

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
    </div>
  </div>
);

export default Sidebar;
