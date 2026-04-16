'use client';

import { Suspense } from 'react';

import EmbeddedMap from '@/containers/embedded/map';

export default function Embedded() {
  return (
    <Suspense>
      <EmbeddedMap mapId="embedded" />
    </Suspense>
  );
}
