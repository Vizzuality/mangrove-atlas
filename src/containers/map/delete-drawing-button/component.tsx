import { useCallback } from 'react';

import { useRouter } from 'next/router';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';

import { useResetRecoilState, useSetRecoilState } from 'recoil';

import Icon from 'components/icon';

import REMOVE_SVG from 'svgs/remove.svg?sprite';

export const DeleteDrawingButton = () => {
  const setDrawingToolState = useSetRecoilState(drawingToolAtom);
  const resetAnalysisState = useResetRecoilState(analysisAtom);
  const { replace, asPath } = useRouter();

  const handleDeleteDrawing = useCallback(async () => {
    const queryParams = asPath.split('?')[1];

    setDrawingToolState((prevDrawingState) => ({
      ...prevDrawingState,
      enabled: false,
      showWidget: true,
      customGeojson: null,
      uploadedGeojson: null,
    }));

    resetAnalysisState();

    await replace(`/?${queryParams}`, null);
  }, [setDrawingToolState, resetAnalysisState, replace, asPath]);

  return (
    <div className="flex h-11 items-center justify-between rounded-md bg-brand-800 px-6 py-3 shadow-medium">
      <p className="text-xs font-semibold uppercase tracking-wide text-white">Delete custom area</p>
      <button onClick={handleDeleteDrawing}>
        <Icon icon={REMOVE_SVG} className="h-5 w-5" />
      </button>
    </div>
  );
};

export default DeleteDrawingButton;
