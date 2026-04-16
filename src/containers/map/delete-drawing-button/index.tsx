import { useCallback, useMemo, ReactElement } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter, useSearchParams } from 'next/navigation';

import cn from '@/lib/classnames';

import { analysisAtom } from '@/store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { printModeState } from '@/store/print-mode';
import { locationToolAtom } from '@/store/sidebar';

import { useAtomValue } from 'jotai';
import { useResetAtom } from 'jotai/utils';

import REMOVE_SVG from '@/svgs/ui/close';

const SIZE = {
  md: 'h-11 w-11',
  sm: 'h-8 w-8',
};

export const DeleteDrawingButton = ({
  size = 'md',
  children = null,
}: {
  size?: 'sm' | 'md';
  children?: ReactElement;
}) => {
  const resetAnalysisState = useResetAtom(analysisAtom);
  const locationTool = useAtomValue(locationToolAtom);
  const resetDrawingState = useResetAtom(drawingToolAtom);
  const resetUploadedGeojson = useResetAtom(drawingUploadToolAtom);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParams = useMemo(() => searchParams.toString(), [searchParams]);
  const isPrintingMode = useAtomValue(printModeState);

  const isPrintingId = isPrintingMode ? 'print-mode' : 'no-print';

  const { [`default-desktop-${isPrintingId}`]: map } = useMap();
  const handleWorldwideView = useCallback(() => {
    resetDrawingState();
    resetUploadedGeojson();
    resetAnalysisState();

    router.replace(`/?${queryParams}`);

    map?.flyTo({
      center: [0, 20],
      zoom: 2,
    });
  }, [router, map, queryParams, resetAnalysisState, resetDrawingState, resetUploadedGeojson]);

  const handleResetPage = useCallback(() => {
    if (locationTool === 'worldwide') {
      handleWorldwideView();
    }
    resetDrawingState();
    resetAnalysisState();

    router.replace(`/?${queryParams}`);
  }, [
    locationTool,
    queryParams,
    router,
    resetDrawingState,
    resetAnalysisState,
    handleWorldwideView,
  ]);

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-1">
      <div
        className={cn({
          'shadow-controls bg-brand-800 flex items-center justify-center rounded-full': true,
          [SIZE[size]]: true,
        })}
      >
        <button onClick={handleResetPage} data-testid="delete-custom-area-button">
          <REMOVE_SVG
            className="h-3.5 w-3.5 fill-current text-white"
            role="img"
            aria-hidden={true}
          />
        </button>
      </div>
      {/* {children && children} */}
    </div>
  );
};

export default DeleteDrawingButton;
