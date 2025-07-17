import { useCallback, useEffect } from 'react';

import cn from 'lib/classnames';

import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';
import { mapCursorAtom } from 'store/map';

import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';

import Helper from 'containers/help/helper';
import DeleteDrawingButton from 'containers/map/delete-drawing-button';

import Icon from 'components/ui/icon';

import AREA_SVG from 'svgs/sidebar/area.svg?sprite';
import { trackEvent } from 'lib/analytics/ga';

const WidgetDrawingTool = ({ menuItemStyle }: { menuItemStyle?: string }) => {
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
    // Google Analytics tracking
    trackEvent(
      `Drawing tool - ${isDrawingToolEnabled && !uploadedGeojson ? 'delete' : 'draw'} polygon`,
      {
        action: 'draw polygon',
        label: `Drawing tool - ${isDrawingToolEnabled && !uploadedGeojson ? 'delete' : 'draw'} polygon`,
      }
    );
  }, [setDrawingToolState, isDrawingToolEnabled, resetDrawingUploadToolState]);

  useEffect(() => {
    setMapCursor(isDrawingToolEnabled ? 'cell' : 'grab');
  }, [setMapCursor, isDrawingToolEnabled]);

  return (
    <Helper
      className={{
        button: 'right-1.5 -top-1 z-[20]',
        tooltip: 'w-fit max-w-[400px]',
      }}
      tooltipPosition={{ top: -65, left: -10 }}
      message="Use this function to draw a polygon on the map to calculate statistics for your area of interest. Complete the polygon by double clicking. The widgets will update with statistics for the area drawn."
    >
      {/* TO - DO - This tool is limited to areas between xx km2 and xx km2. */}
      <button
        type="button"
        className={cn({
          'mb-2 flex cursor-pointer flex-col items-center justify-center space-y-1 rounded-3xl p-2':
            true,
          'bg-white': isDrawingToolEnabled && !uploadedGeojson,
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
            // Minimum width is customized to prevent layout shifts in the menu when the text changes.
            // It's based on the width of the longest possible label
            'min-w-[75.05px] whitespace-nowrap font-sans text-sm text-white': true,
            'text-brand-800': isDrawingToolEnabled && !uploadedGeojson,
          })}
        >
          {/* Update width above if these text change */}
          {isDrawingToolEnabled && !uploadedGeojson ? 'Delete area' : 'Draw area'}
        </span>
      </button>
    </Helper>
  );
};

export default WidgetDrawingTool;
