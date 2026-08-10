'use client';

import { Suspense } from 'react';

import EmbeddedMap from '@/containers/embedded/map';

export default function EmbeddedWrapper() {
  return (
    // id="main-content" is the target of the root layout's skip link, which is
    // rendered on every route including this one.
    <main id="main-content" className="h-full w-full">
      <Suspense>
        <EmbeddedMap mapId="embedded" />
      </Suspense>
    </main>
  );
}
