import { useCallback } from 'react';

import { useMap } from 'react-map-gl';

import Image from 'next/image';
import Link from 'next/link';

import NavigationBar from '@/containers/navigation/mobile';

import LOGO_MOBILE_SVG from '@/svgs/logo-mobile';

// Chrome only. The widgets list and welcome message are rendered once by
// MainApp (which also owns the mobile map-view visibility toggle) so they are
// not duplicated across the desktop/mobile layouts.
const MobileLayout = () => {
  const map = useMap();

  const handleReset = useCallback(() => {
    // See desktop layout: chain through the keyed ref, not just `map`.
    map?.['default']?.flyTo({
      center: [0, 20],
      zoom: 2,
    });
  }, [map]);

  return (
    <div className="pointer-events-none h-screen">
      <Link className="pointer-events-auto fixed -top-1 left-0 z-10" href="/" onClick={handleReset}>
        <Image
          src="/images/mobile-header.svg"
          alt="Global Mangrove Watch"
          width={330}
          height={72}
          className="h-[72px] w-[330px]"
        />
        <LOGO_MOBILE_SVG
          className="absolute top-2 left-4 z-50 h-8 w-20 fill-current"
          aria-hidden="true"
        />
      </Link>
      <NavigationBar />
    </div>
  );
};

export default MobileLayout;
