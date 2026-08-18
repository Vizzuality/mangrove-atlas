'use client';

import { useMemo } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import useIsClient from 'hooks/use-is-client';

/**
 * Closing block of the report: attribution plus the app URL this report was
 * generated from, so a printed copy can be traced back to the exact map state.
 */
const PrintFooter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isClient = useIsClient();

  const sourceUrl = useMemo(() => {
    if (!isClient) return null;
    const params = new URLSearchParams(searchParams.toString());
    params.delete('autoprint');
    const appPath = (pathname ?? '').replace(/^\/print-report/, '') || '/';
    const qs = params.toString();
    return `${window.location.origin}${appPath}${qs ? `?${qs}` : ''}`;
  }, [isClient, pathname, searchParams]);

  return (
    <footer className="mt-2 break-inside-avoid px-4 pb-6 text-xs text-black/60">
      <p>
        Generated from Global Mangrove Watch &middot;{' '}
        <span className="notranslate">globalmangrovewatch.org</span>. Dataset sources and
        methodology for each indicator are described in its info panel on the site.
      </p>
      {sourceUrl && (
        <p className="mt-1 break-all">
          View this report online: <span className="notranslate">{sourceUrl}</span>
        </p>
      )}
    </footer>
  );
};

export default PrintFooter;
