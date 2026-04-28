'use client';

import { useCallback, useMemo } from 'react';

import { useSyncLocation } from 'hooks/use-sync-location';

import { useLocation } from '@/containers/datasets/locations/hooks';
import type { LocationTypes } from '@/containers/datasets/locations/types';

const PrintHeader = () => {
  const { type, id } = useSyncLocation();
  const locationType = (type ?? 'worldwide') as LocationTypes;
  const {
    data: { name: locationName },
  } = useLocation(id, locationType, {
    enabled: (!!locationType && !!id) || locationType !== 'custom-area',
  });

  const displayName = useMemo(() => {
    if (locationType === 'custom-area') return 'Custom Area';
    return locationName || 'Worldwide';
  }, [locationType, locationName]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="flex items-center gap-4 py-4">
      <button
        type="button"
        onClick={handlePrint}
        className="print-report-no-print bg-brand-800 hover:bg-brand-800/90 rounded-3xl px-8 py-2 text-sm font-semibold text-white shadow-md transition-colors"
      >
        Print report
      </button>
      <div>
        <h1 className="text-3xl font-light text-black/85 first-letter:uppercase">{displayName}</h1>
        <p className="mt-1 text-sm text-black/60">
          Powered by Global Mangrove Watch &middot; globalmangrovewatch.org
        </p>
      </div>
    </div>
  );
};

export default PrintHeader;
