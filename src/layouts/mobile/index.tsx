import { useCallback } from 'react';

import { useMap } from 'react-map-gl';

import Image from 'next/image';
import Link from 'next/link';

import NavigationBar from '@/containers/navigation/mobile';
import ViewTabs from '@/containers/navigation/mobile/view-tabs';

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
    // No intrinsic height: the header and nav below are both `fixed` (out of
    // flow), so this chrome-only layout must not add a full-height block. An
    // `h-screen` here stacked a second viewport-tall block in front of <main>
    // inside the shared `overflow-hidden` wrapper, letting it scroll one
    // viewport and dragging the absolute-positioned map off-screen (GMW-1070).
    <div className="pointer-events-none">
      <Link
        className="pointer-events-auto fixed -top-1 right-0 z-10"
        href="/"
        onClick={handleReset}
      >
        <Image
          src="/images/mobile-header.svg"
          alt="Global Mangrove Watch"
          width={330}
          height={72}
          priority
          className="h-[72px] w-[330px] -scale-x-100"
        />
        <LOGO_MOBILE_SVG
          className="absolute top-2 right-4 z-50 h-8 w-20 fill-current"
          aria-hidden="true"
        />
      </Link>
      <div className="pointer-events-auto fixed top-4 left-4 z-20">
        <ViewTabs />
      </div>
      <NavigationBar />
    </div>
  );
};

export default MobileLayout;
