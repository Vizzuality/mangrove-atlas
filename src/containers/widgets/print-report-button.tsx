import { useCallback } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { customAreaLabelAtom, drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { locationToolAtom } from '@/store/sidebar';

import { useIsFetching } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import Helper from '@/containers/help/helper';
import { PRINT_REPORT_PARAM, savePrintReportArea } from '@/containers/print-report/storage';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function PrintReportButton() {
  const locationTool = useAtomValue(locationToolAtom);
  const fetchingCount = useIsFetching();
  const isDisabled = fetchingCount > 0;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { customGeojson } = useAtomValue(drawingToolAtom);
  const { uploadedGeojson } = useAtomValue(drawingUploadToolAtom);
  const customAreaLabel = useAtomValue(customAreaLabelAtom);

  const handlePrintReport = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    // The new tab doesn't share in-memory atoms, so the geometry goes through localStorage.
    const geojson = customGeojson || uploadedGeojson;
    const reportId = geojson ? savePrintReportArea(geojson, customAreaLabel) : null;
    if (reportId) params.set(PRINT_REPORT_PARAM, reportId);

    const qs = params.toString();
    const printPath = `/print-report${pathname === '/' ? '' : pathname}`;
    window.open(qs ? `${printPath}?${qs}` : printPath, '_blank');
  }, [pathname, searchParams, customGeojson, uploadedGeojson, customAreaLabel]);

  const helperButtonClass =
    locationTool === 'upload' || locationTool === 'area' ? 'hidden' : 'right-0 -bottom-2.5';

  return (
    <div className="flex w-full justify-center py-4">
      <Helper
        className={{ button: helperButtonClass, tooltip: 'w-fit-content' }}
        tooltipPosition={{ top: 50, left: 10 }}
        message="Use this button to open the current map view and associated widgets as a printable PDF report."
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <button
                type="button"
                aria-label="Print PDF report"
                className="bg-brand-800 shadow-control hover:bg-brand-800/90 focus-visible:ring-brand-400 inline-flex h-12 cursor-pointer items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handlePrintReport}
                disabled={isDisabled}
                aria-busy={isDisabled || undefined}
              >
                Print PDF report
              </button>
            </span>
          </TooltipTrigger>
          {isDisabled && <TooltipContent>Loading analysis data...</TooltipContent>}
        </Tooltip>
      </Helper>
    </div>
  );
}
