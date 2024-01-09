import { useCallback, useMemo } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter } from 'next/router';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';
import { printModeState } from 'store/print-mode';
import { locationToolAtom } from 'store/sidebar';

import { useResetRecoilState, useRecoilValue } from 'recoil';

import Icon from 'components/icon';

import REMOVE_SVG from 'svgs/ui/close.svg?sprite';

export const DeleteDrawingButton = () => {
  const resetAnalysisState = useResetRecoilState(analysisAtom);
  const locationTool = useRecoilValue(locationToolAtom);
  const resetDrawingState = useResetRecoilState(drawingToolAtom);
  const { replace, asPath } = useRouter();
  const queryParams = useMemo(() => asPath.split('?')[1], [asPath]);
  const isPrintingMode = useRecoilValue(printModeState);

  const isPrintingId = isPrintingMode ? 'print-mode' : 'no-print';

  const { [`default-desktop-${isPrintingId}`]: map } = useMap();
  const handleWorldwideView = useCallback(() => {
    resetDrawingState();
    resetAnalysisState();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    replace(`/?${queryParams}`, null);

    map.flyTo({
      center: [0, 20],
      zoom: 2,
    });
  }, [replace, map, queryParams, resetAnalysisState, resetDrawingState]);

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
    <div className="shadow-controls flex h-11 w-11 items-center justify-center rounded-full border border-brand-800 bg-brand-800">
      <button onClick={handleResetPage} data-testid="delete-custom-area-button">
        <Icon icon={REMOVE_SVG} className="h-5 w-5 text-white" />
      </button>
    </div>
  );
};

export default DeleteDrawingButton;
