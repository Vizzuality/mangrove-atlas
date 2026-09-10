'use client';

import useIsClient from 'hooks/use-is-client';
import { useSyncLocation } from 'hooks/use-sync-location';

import type { LocationTypes } from '@/containers/datasets/locations/types';

const LOCATION_TYPE_LABELS: Partial<Record<LocationTypes | 'worldwide', string>> = {
  country: 'Country',
  wdpa: 'Protected area',
  'custom-area': 'Custom area',
  worldwide: 'Worldwide',
};

/**
 * Closes the report: who made it and when. It sits at the end of the document,
 * so it prints once, on the last page — the masthead keeps the location name
 * alone and the space it used to take goes to the map.
 */
const PrintFooter = () => {
  const { type } = useSyncLocation();
  const locationType = (type ?? 'worldwide') as LocationTypes;
  const typeLabel = LOCATION_TYPE_LABELS[locationType];

  // Client-only: the server has no notion of the reader's locale or timezone,
  // so formatting the date during SSR would trip a hydration mismatch.
  const isClient = useIsClient();
  const generatedOn = isClient
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date())
    : null;

  return (
    <footer className="mt-4 break-inside-avoid pt-4 pb-8 text-center">
      <p className="text-lg font-light text-black/85">
        Powered by Global Mangrove Watch &middot;{' '}
        <span className="notranslate">globalmangrovewatch.org</span>
      </p>
      <p className="mt-1 text-sm text-black/54">
        {typeLabel && <span>{typeLabel} &middot; </span>}
        {generatedOn && <span className="notranslate">{generatedOn}</span>}
      </p>
    </footer>
  );
};

export default PrintFooter;
