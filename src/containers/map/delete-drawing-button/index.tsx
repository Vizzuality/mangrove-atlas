import { useCallback, useMemo, ReactElement } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';
import { printModeState } from 'store/print-mode';
import { locationToolAtom } from 'store/sidebar';

import { useResetRecoilState, useRecoilValue } from 'recoil';

import Icon from 'components/icon';

import REMOVE_SVG from 'svgs/ui/close.svg?sprite';

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
  const resetAnalysisState = useResetRecoilState(analysisAtom);
  const locationTool = useRecoilValue(locationToolAtom);
  const resetDrawingState = useResetRecoilState(drawingToolAtom);
  const resetUploadedGeojson = useResetRecoilState(drawingUploadToolAtom);
  const { replace, asPath } = useRouter();
  const queryParams = useMemo(() => asPath.split('?')[1], [asPath]);
  const isPrintingMode = useRecoilValue(printModeState);

  const isPrintingId = isPrintingMode ? 'print-mode' : 'no-print';

  const { [`default-desktop-${isPrintingId}`]: map } = useMap();
  const handleWorldwideView = useCallback(() => {
    resetDrawingState();
    resetUploadedGeojson();
    resetAnalysisState();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    replace(`/?${queryParams}`, null);

    map.flyTo({
      center: [0, 20],
      zoom: 2,
    });
  }, [replace, map, queryParams, resetAnalysisState, resetDrawingState, resetUploadedGeojson]);

  const handleResetPage = useCallback(() => {
    if (locationTool === 'worldwide') {
      handleWorldwideView();
    }
    resetDrawingState();
    resetAnalysisState();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    replace(`/?${queryParams}`, null);
  }, [
    locationTool,
    queryParams,
    replace,
    resetDrawingState,
    resetAnalysisState,
    handleWorldwideView,
  ]);

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-1">
      <div
        className={cn({
          'shadow-controls flex items-center justify-center rounded-full border border-brand-800 bg-brand-800':
            true,
          [SIZE[size]]: true,
        })}
      >
        <button onClick={handleResetPage} data-testid="delete-custom-area-button">
          <Icon icon={REMOVE_SVG} className="h-5 w-5 text-white" />
        </button>
      </div>
      {children && children}
    </div>
  );
};

export default DeleteDrawingButton;
