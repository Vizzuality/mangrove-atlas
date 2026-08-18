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
    <footer className="mt-4 break-inside-avoid pt-4 pb-8 text-center">
      <p className="text-lg font-light text-black/85">
        Generate your report at <span className="notranslate">globalmangrovewatch.org</span>
      </p>
      {sourceUrl && (
        <p className="mt-2 text-xs break-all text-black/54">
          <span className="notranslate">{sourceUrl}</span>
        </p>
      )}
    </footer>
  );
};

export default PrintFooter;
