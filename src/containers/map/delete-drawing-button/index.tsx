import { useCallback, ReactElement } from 'react';

import cn from '@/lib/classnames';

import { analysisAtom } from '@/store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { printModeState } from '@/store/print-mode';

import { useAtomValue } from 'jotai';
import { useResetAtom } from 'jotai/utils';

import { useLocationNavigation } from 'hooks/location-navigation';

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
  const resetDrawingState = useResetAtom(drawingToolAtom);
  const resetUploadedGeojson = useResetAtom(drawingUploadToolAtom);
  const isPrintingMode = useAtomValue(printModeState);
  const { navigate } = useLocationNavigation();

  const handleResetPage = useCallback(() => {
    resetDrawingState();
    resetAnalysisState();
    resetUploadedGeojson();
    navigate({ type: 'worldwide' });
  }, [navigate, resetDrawingState, resetUploadedGeojson, resetAnalysisState]);

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
    </div>
  );
};

export default DeleteDrawingButton;
