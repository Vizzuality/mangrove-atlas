'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useSearchParams } from 'next/navigation';

import useIsClient from 'hooks/use-is-client';
import { useSyncLocation } from 'hooks/use-sync-location';

import { useLocation } from '@/containers/datasets/locations/hooks';
import type { LocationTypes } from '@/containers/datasets/locations/types';

import usePrintReady from './use-print-ready';

const LOCATION_TYPE_LABELS: Partial<Record<LocationTypes | 'worldwide', string>> = {
  country: 'Country',
  wdpa: 'Protected area',
  'custom-area': 'Custom area',
  worldwide: 'Worldwide',
};

const PrintHeader = () => {
  const { type, id } = useSyncLocation();
  const locationType = (type ?? 'worldwide') as LocationTypes;
  const {
    data: { name: locationName },
  } = useLocation(id, locationType, {
    enabled: (!!locationType && !!id) || locationType !== 'custom-area',
  });

  const isReady = usePrintReady();
  const searchParams = useSearchParams();
  const shouldAutoPrint = searchParams.get('autoprint') === '1';
  const hasAutoPrinted = useRef(false);

  const displayName = useMemo(() => {
    if (locationType === 'custom-area') return 'Custom Area';
    return locationName || 'Worldwide';
  }, [locationType, locationName]);

  const typeLabel = LOCATION_TYPE_LABELS[locationType];

  // Client-only: the server has no notion of the reader's locale or timezone,
  // so formatting the date during SSR would trip a hydration mismatch.
  const isClient = useIsClient();
  const generatedOn = isClient
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date())
    : null;

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  useEffect(() => {
    if (!shouldAutoPrint || !isReady || hasAutoPrinted.current) return;
    hasAutoPrinted.current = true;
    window.print();
  }, [shouldAutoPrint, isReady]);

  return (
    // The title block is centred over the page, as in the report design; the
    // print button sits outside the flow so it cannot shift that centring.
    // Tighter in print: the first page has to hold the map and the lead widget
    // under it, and every millimetre the masthead takes comes out of the map.
    <div className="relative py-6 text-center print:py-3">
      <button
        type="button"
        onClick={handlePrint}
        disabled={!isReady}
        aria-busy={!isReady || undefined}
        className="print-report-no-print bg-brand-800 hover:bg-brand-800/90 absolute top-6 left-0 rounded-3xl px-8 py-2 text-sm font-semibold text-white shadow-md transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isReady ? 'Print report' : 'Preparing report…'}
      </button>
      <h1 className="text-5xl leading-tight font-light text-black/85 first-letter:uppercase print:text-4xl">
        {displayName}
      </h1>
      <p className="mt-2 text-lg font-light text-black/85">
        Powered by Global Mangrove Watch &middot;{' '}
        <span className="notranslate">globalmangrovewatch.org</span>
      </p>
      <p className="mt-1 text-sm text-black/54">
        {typeLabel && <span>{typeLabel} &middot; </span>}
        {generatedOn && <span className="notranslate">{generatedOn}</span>}
      </p>
    </div>
  );
};

export default PrintHeader;
