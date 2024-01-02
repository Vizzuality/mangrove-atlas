import { useCallback, useMemo } from 'react';

import { useRouter } from 'next/router';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';

import { useResetRecoilState, useSetRecoilState } from 'recoil';

import Icon from 'components/icon';

import REMOVE_SVG from 'svgs/ui/close.svg?sprite';

export const DeleteDrawingButton = () => {
  const setDrawingToolState = useSetRecoilState(drawingToolAtom);
  const resetAnalysisState = useResetRecoilState(analysisAtom);
  const { replace, asPath } = useRouter();
  const queryParams = useMemo(() => asPath.split('?')[1], [asPath]);

  const handleDeleteDrawing = useCallback(() => {
    setDrawingToolState((prevDrawingState) => ({
      ...prevDrawingState,
      enabled: false,
      showWidget: true,
      customGeojson: null,
      uploadedGeojson: null,
    }));

    resetAnalysisState();

    replace(`/custom-area${queryParams ? `?${queryParams}` : ''}`, null);
  }, [setDrawingToolState, resetAnalysisState, replace, queryParams]);

  return (
    <div className="shadow-controls flex h-11 w-11 items-center justify-center rounded-full border border-brand-800 bg-brand-800">
      <button onClick={handleDeleteDrawing} data-testid="delete-custom-area-button">
        <Icon icon={REMOVE_SVG} className="h-5 w-5 text-white" />
      </button>
    </div>
  );
};

export default DeleteDrawingButton;
