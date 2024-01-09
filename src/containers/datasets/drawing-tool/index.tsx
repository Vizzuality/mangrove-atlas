import { useCallback, useEffect } from 'react';

import { useDropzone } from 'react-dropzone';

import cn from 'lib/classnames';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';
import { mapCursorAtom } from 'store/map';

import { useRecoilState, useSetRecoilState } from 'recoil';

import { useUploadFile } from 'hooks/analysis';

import Icon from 'components/icon';

import AREA_SVG from 'svgs/sidebar/area.svg?sprite';

const WidgetDrawingTool = () => {
  const [{ enabled: isDrawingToolEnabled }, setDrawingToolState] = useRecoilState(drawingToolAtom);

  const setAnalysisState = useSetRecoilState(analysisAtom);
  const setMapCursor = useSetRecoilState(mapCursorAtom);

  const { acceptedFiles } = useDropzone({
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
    <button
      type="button"
      className="flex w-28 cursor-pointer flex-col items-center justify-center space-y-1"
      onClick={handleDrawingMode}
      data-testid="drawing-tool-button"
    >
      <Icon
        icon={AREA_SVG}
        className={cn({
          'h-8 w-8 rounded-full fill-current text-white': true,
        })}
        description="Area"
      />

      <span className="whitespace-nowrap font-sans text-sm text-white">
        {isDrawingToolEnabled ? 'Start drawing' : 'Draw area'}
      </span>
    </button>
  );
};

export default WidgetDrawingTool;
