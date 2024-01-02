import { useCallback, useEffect } from 'react';

import { useDropzone } from 'react-dropzone';

import cn from 'lib/classnames';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';
import { mapCursorAtom } from 'store/map';

import { useRecoilState, useSetRecoilState } from 'recoil';

import { useUploadFile } from 'hooks/analysis';

import Helper from 'containers/guide/helper';

import Icon from 'components/icon';
import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import AREA_SVG from 'svgs/sidebar/area.svg?sprite';

const WidgetDrawingTool = () => {
  const [{ enabled: isDrawingToolEnabled }, setDrawingToolState] = useRecoilState(drawingToolAtom);

  const setAnalysisState = useSetRecoilState(analysisAtom);
  const setMapCursor = useSetRecoilState(mapCursorAtom);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    multiple: false,
    accept: {
      'multipart/form-data': ['.zip', '.gpkg', '.geojson', '.json'],
    },
  });

  const onUploadFile = useCallback<Parameters<typeof useUploadFile>[1]>(
    (geojson) => {
      setDrawingToolState((drawingToolState) => ({
        ...drawingToolState,
        showWidget: false,
        uploadedGeojson: geojson.data,
        customGeojson: null,
      }));

      setAnalysisState((prevAnalysisState) => ({
        ...prevAnalysisState,
        enabled: true,
      }));
    },
    [setDrawingToolState, setAnalysisState]
  );

  const handleDrawingMode = useCallback(() => {
    setDrawingToolState((drawingToolState) => ({
      ...drawingToolState,
      enabled: !isDrawingToolEnabled,
    }));
  }, [setDrawingToolState, isDrawingToolEnabled]);

  useUploadFile(acceptedFiles?.[0], onUploadFile);

  useEffect(() => {
    setMapCursor(isDrawingToolEnabled ? 'crosshair' : 'grab');
  }, [setMapCursor, isDrawingToolEnabled]);

  return (
    <div
      className={cn({
        [WIDGET_CARD_WRAPPER_STYLE]: true,
        'space-y-4 pb-6': true,
      })}
    >
      <div className="space-y-4">
        <span>Draw in the map the area you want to analyze through on-the-fly calculations.</span>

        <Helper
          className={{
            button: '-bottom-2.5 -right-0',
            tooltip: 'w-fit-content',
            active: 'max-w-[454px]',
          }}
          tooltipPosition={{ top: -100, left: -100 }}
          message="draw a polygon on the map. Just click to start drawing and double click to stop"
        >
          <button
            aria-label="Start drawing on the map"
            type="button"
            onClick={handleDrawingMode}
            className={cn({
              'flex h-[88px] w-full items-center justify-center space-x-2 rounded-lg border-2 border-brand-800/10 py-5 font-semibold text-brand-800 transition-colors':
                true,
              'hover:bg-brand-400/10': !isDrawingToolEnabled,
              'bg-brand-800 text-white': isDrawingToolEnabled,
            })}
            data-testid="start-drawing-button"
          >
            <Icon icon={AREA_SVG} className="h-8 w-8" description="Draw polygon" />
            <span>{isDrawingToolEnabled ? 'Start drawing on the map' : 'Draw area'}</span>
          </button>
        </Helper>
      </div>
    </div>
  );
};

export default WidgetDrawingTool;
