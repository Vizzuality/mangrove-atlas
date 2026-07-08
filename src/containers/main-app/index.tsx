'use client';

import dynamic from 'next/dynamic';

import cn from '@/lib/classnames';

import { mapViewAtom } from '@/store/sidebar';

import { useAtomValue } from 'jotai';

import DesktopLayout from '@/layouts/desktop';
import MobileLayout from '@/layouts/mobile';

import WidgetsContainer from '@/containers/widgets';

import { Media } from '@/components/media-query';

const WelcomeIntroMessage = dynamic(() => import('@/containers/welcome-message'), { ssr: false });

export default function MainApp() {
  // `mapView` toggles map-only vs widgets on mobile; desktop always shows the
  // widgets. Default is `false` (widgets-first on mobile); when the user opens
  // the map it flips to `true` and the list is hidden below `lg` via responsive
  // CSS (`hidden lg:block`) rather than a JS/viewport check.
  const mapView = useAtomValue(mapViewAtom);

  return (
    <>
      {/*
        Both layouts are rendered server-side; fresnel's media-query CSS shows
        the right one. Gating the layout on useWindowSize() previously left the
        first paint with the wrong layout until hydration, causing a large
        layout shift on desktop. The widgets list is rendered once here (not per
        layout) so its test ids and data hooks are not duplicated in the DOM.
      */}
      <Media greaterThanOrEqual="lg">
        <DesktopLayout />
      </Media>
      <Media lessThan="lg">
        <MobileLayout />
      </Media>

      <main id="main-content" className="pointer-events-none relative h-screen w-screen">
        {/* h-full is required: the widgets layout scrolls internally
            (h-full + overflow-y-auto) and needs a definite-height parent —
            without it the list grows to content height and mobile can't scroll. */}
        <div className={cn('h-full', { 'hidden lg:block': mapView })}>
          <WidgetsContainer />
        </div>
      </main>

      <WelcomeIntroMessage />
    </>
  );
}
