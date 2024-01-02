import { useCallback, useEffect } from 'react';

import { useDropzone } from 'react-dropzone';

import cn from 'lib/classnames';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';
import { mapCursorAtom } from 'store/map';

import { useRecoilState, useSetRecoilState } from 'recoil';

import { useUploadFile } from 'hooks/analysis';

import Helper from 'containers/guide/helper';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';
import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import UPLOAD_SVG from 'svgs/upload.svg?sprite';

const WidgetDrawingUploadTool = () => {
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

  useUploadFile(acceptedFiles?.[0], onUploadFile);

  useEffect(() => {
    setMapCursor(isDrawingToolEnabled ? 'crosshair' : 'grab');
  }, [setMapCursor, isDrawingToolEnabled]);

  return (
    <div
      className={cn({
        [WIDGET_CARD_WRAPPER_STYLE]: true,
        'space-y-4 pb-0': true,
      })}
    >
      <div className="space-y-4">
        <span>Upload the area you want to analyze through on-the-fly calculations.</span>

        <Helper
          className={{
            button: '-bottom-2.5 -right-0',
            tooltip: 'w-fit-content',
            active: 'max-w-[454px]',
          }}
          tooltipPosition={{ top: -100, left: -100 }}
          message="use this to upload an existing GIS file"
        >
          <div
            {...getRootProps()}
            className="flex h-[88px] w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-brand-800 bg-brand-400/10 py-5"
          >
            <input data-testid="shapefile-upload" {...getInputProps()} />
            <div className="pointer-events-none flex items-center space-x-2">
              <span className="text-brand-800">
                <Icon
                  icon={UPLOAD_SVG}
                  className="h-8 w-8 fill-brand-800"
                  description="upload geometry"
                />
              </span>
              <label id="label-file-upload" htmlFor="input-file-upload">
                <div>
                  <span className="block font-semibold text-brand-800">Browse shapefile</span>
                  <span>(Click or drag-and-drop file)</span>
                </div>
              </label>
            </div>
          </div>
        </Helper>
      </div>

      <div className="block text-sm">
        Learn more about{' '}
        <Dialog>
          <DialogTrigger asChild>
            <span className="text-brand-800 underline">supported file formats</span>
          </DialogTrigger>
          <DialogContent className="top-24 rounded-3xl px-10">
            <div className="space-y-4">
              <h3 className="font-bold">Analysis of a custom area:</h3>
              <span className="text-lg">Upload a custom shape</span>
              <h3 className="font-bold">Analysis:</h3>
              <p className="text-lg">
                Be aware to upload a minimum size area in order to ensure enough data for the
                analysis. The recommended maximum file size is 10MB. Anything larger than that may
                not work properly.
              </p>
              <h3 className="font-bold">List of supported file formats:</h3>
              <ul className="list-disc pl-5">
                <li>
                  <a
                    className="text-sm text-brand-800 hover:underline"
                    href="https://geojson.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    geoJSON (.json, .geojson)
                  </a>
                </li>
                <li>
                  <a
                    className="text-sm text-brand-800 hover:underline"
                    href="https://www.geopackage.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    geoPackage (.gpkg)
                  </a>
                </li>
                <li>
                  <a
                    className="text-sm text-brand-800 hover:underline"
                    href="https://doc.arcgis.com/en/arcgis-online/reference/shapefiles.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    .zip with the following file formats .shp, .shx, .dbf and .prj
                  </a>
                </li>
              </ul>
            </div>
            <DialogClose />
          </DialogContent>
        </Dialog>
        <span className="block text-sm">
          By uploading data you agree to the{' '}
          <a className="text-brand-800 underline" href="">
            Terms of Service
          </a>
        </span>
      </div>
    </div>
  );
};

export default WidgetDrawingUploadTool;
