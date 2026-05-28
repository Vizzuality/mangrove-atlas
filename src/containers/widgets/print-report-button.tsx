import { FC, useCallback } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { locationToolAtom } from '@/store/sidebar';

import { useIsFetching } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import Helper from '@/containers/help/helper';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { WIDGET_FAB_BUTTON_STYLE } from '@/styles/widgets';

const PrintReportButton: FC = () => {
  const locationTool = useAtomValue(locationToolAtom);
  const fetchingCount = useIsFetching();
  const isDisabled = fetchingCount > 0;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePrintReport = useCallback(() => {
    const qs = searchParams.toString();
    const printPath = `/print-report${pathname === '/' ? '' : pathname}`;
    window.open(qs ? `${printPath}?${qs}` : printPath, '_blank');
  }, [pathname, searchParams]);

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
                className={`${WIDGET_FAB_BUTTON_STYLE} inline-flex cursor-pointer items-center justify-center px-6 disabled:cursor-not-allowed disabled:opacity-50`}
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
};

export default PrintReportButton;
