import { useCallback, useEffect } from 'react';

import cn from 'lib/classnames';

import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';
import { mapCursorAtom } from 'store/map';

import { useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil';

import Helper from 'containers/guide/helper';
import DeleteDrawingButton from 'containers/map/delete-drawing-button';

import Icon from 'components/ui/icon';

import AREA_SVG from 'svgs/sidebar/area.svg?sprite';

const WidgetDrawingTool = () => {
  const [{ enabled: isDrawingToolEnabled }, setDrawingToolState] = useRecoilState(drawingToolAtom);
  const resetDrawingUploadToolState = useResetRecoilState(drawingUploadToolAtom);

  const [{ uploadedGeojson }] = useRecoilState(drawingUploadToolAtom);
  const setMapCursor = useSetRecoilState(mapCursorAtom);

  const handleDrawingMode = useCallback(() => {
    resetDrawingUploadToolState();
    setDrawingToolState((drawingToolState) => ({
      ...drawingToolState,
      enabled: !isDrawingToolEnabled,
    }));
  }, [setDrawingToolState, isDrawingToolEnabled, resetDrawingUploadToolState]);

  useEffect(() => {
    setMapCursor(isDrawingToolEnabled ? 'cell' : 'grab');
  }, [setMapCursor, isDrawingToolEnabled]);

  return (
    <Helper
      className={{
        button: 'top-1 right-9 z-[20]',
        tooltip: 'w-fit-content max-w-[400px]',
      }}
      tooltipPosition={{ top: -65, left: -20 }}
      message="use this function to calculate statistics for your own custom area of interest"
    >
      <button
        type="button"
        className={cn({
          'mb-2 flex w-[128px] cursor-pointer flex-col items-center justify-center space-y-1 rounded-3xl p-2':
            true,
          ' bg-white ': isDrawingToolEnabled && !uploadedGeojson,
          'cursor-default opacity-40': !!uploadedGeojson,
        })}
        onClick={handleDrawingMode}
        data-testid="drawing-tool-button"
        disabled={!!uploadedGeojson}
      >
        {isDrawingToolEnabled ? (
          <DeleteDrawingButton size="sm" />
        ) : (
          <Icon
            icon={AREA_SVG}
            className={cn({
              'h-8 w-8 rounded-full fill-current text-white': true,
            })}
            description="Area"
          />
        )}
        <span
          className={cn({
            'whitespace-nowrap font-sans text-sm text-white': true,
            'text-brand-800': isDrawingToolEnabled && !uploadedGeojson,
          })}
        >
          {isDrawingToolEnabled && !uploadedGeojson ? 'Delete area' : 'Draw area'}
        </span>
      </button>
    </Helper>
  );
};

export default WidgetDrawingTool;
