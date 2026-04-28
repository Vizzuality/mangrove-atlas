import { useCallback } from 'react';

import { useMap } from 'react-map-gl';

import WelcomeIntroMessage from '@/containers/welcome-message';
import WidgetsContainer from '@/containers/widgets';

import Logo from 'components/logo';

const DesktopLayout = () => {
  const map = useMap();

  const handleReset = useCallback(() => {
    // `useMap()` returns a truthy MapCollection even before any <Map /> has
    // mounted; the keyed ref is what can be undefined during the async init
    // window (and forever in non-WebGL environments). Chain through the key.
    map?.['default']?.flyTo({
      center: [0, 20],
      zoom: 2,
    });
  }, [map]);

  return (
    <div className="pointer-events-none">
      <Logo
        src="/images/logo-bg.png"
        position="top-right"
        width={186}
        height={216}
        onClick={handleReset}
      />

      <div className="relative h-screen w-screen">
        <WidgetsContainer />

        <WelcomeIntroMessage />
      </div>
    </div>
  );
};

export default DesktopLayout;
