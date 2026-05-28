import { useCallback } from 'react';

import { useMap } from 'react-map-gl';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

import { mapViewAtom } from '@/store/sidebar';

import { useAtomValue } from 'jotai';

import NavigationBar from '@/containers/navigation/mobile';
import WidgetsContainer from '@/containers/widgets';

const WelcomeIntroMessage = dynamic(() => import('@/containers/welcome-message'), { ssr: false });

import LOGO_MOBILE_SVG from '@/svgs/logo-mobile';

const MobileLayout = () => {
  const mapView = useAtomValue(mapViewAtom);
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
          width={100}
          height={100}
          priority
          className="h-[72px] w-[330px]"
        />
        <LOGO_MOBILE_SVG
          className="absolute top-2 left-4 z-50 h-8 w-20 fill-current"
          aria-hidden="true"
        />
      </Link>
      <NavigationBar />
      <WelcomeIntroMessage />
      <main id="main-content">{!mapView && <WidgetsContainer />}</main>
    </div>
  );
};

export default MobileLayout;
