import { useCallback } from 'react';

import { useDropzone } from 'react-dropzone';

import cn from 'lib/classnames';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';

import { useRecoilState, useSetRecoilState } from 'recoil';

import { useUploadFile } from 'hooks/analysis';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

import AREA_SVG from 'svgs/sidebar/area.svg?sprite';
import UPLOAD_SVG from 'svgs/upload.svg?sprite';

const WidgetDrawingTool = () => {
  const [drawingToolState, setDrawingToolState] = useRecoilState(drawingToolAtom);
  const { enabled: isDrawingToolEnabled } = drawingToolState;
  const setAnalysisState = useSetRecoilState(analysisAtom);

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

  return (
    <div
      className={cn({
        [WIDGET_CARD_WRAPER_STYLE]: true,
        'space-y-4': true,
      })}
    >
      <div className="space-y-4">
        <span>
          Upload or draw in the map the area you want to analyze through on-the-fly calculations.
        </span>
        <button
          type="button"
          onClick={handleDrawingMode}
          className={cn({
            'flex w-full items-center justify-center space-x-2  rounded-lg border-2 border-brand-800/10 py-5 font-semibold text-brand-800 transition-colors':
              true,
            'bg-brand-800 text-white': isDrawingToolEnabled,
          })}
        >
          <Icon icon={AREA_SVG} className="h-8 w-8" />
          <span>{isDrawingToolEnabled ? 'Start drawing on the map' : 'Draw area'}</span>
        </button>
        <span className="flex justify-center">or</span>
        {true ? (
          <div
            {...getRootProps()}
            className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-brand-800 bg-brand-400/10 py-5"
          >
            <input {...getInputProps()} />
            <div className="pointer-events-none flex items-center space-x-2">
              <span className="text-brand-800">
                <Icon icon={UPLOAD_SVG} className="h-8 w-8 fill-brand-800" />
              </span>
              <label id="label-file-upload" htmlFor="input-file-upload">
                <div>
                  <span className="block font-semibold text-brand-800">Browse shapefile</span>
                  <span>(Click or drag-and-drop file)</span>
                </div>
              </label>
            </div>
          </div>
        ) : (
          <div>
            {/* {acceptedFileItems} */}
            <span>Upload shapefile</span>
          </div>
        )}
      </div>
      <div>
        <span className="block text-sm">
          Learn more about{' '}
          <Dialog>
            <DialogTrigger>
              <span>supported file formats</span>
            </DialogTrigger>
            <DialogContent className="h-[90vh] w-[540px] rounded-[20px] px-10 pt-10 pb-0">
              <div className="bg-red">some content</div>
              <DialogClose />
            </DialogContent>
          </Dialog>
          {/* <Info slug="drawingToolAlert" icon={false}>

        </Info> */}
          {/* // todo: ask for URL for terms of service link */}
          <span className="block text-sm">
            By uploading data you agree to the{' '}
            <a className="text-brand-800 underline" href="">
              Terms of Service
            </a>
          </span>
        </span>
      </div>
    </div>
  );
};

export default WidgetDrawingTool;
