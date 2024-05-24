import { useCallback, useEffect } from 'react';

import { useDropzone } from 'react-dropzone';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { analysisAtom } from 'store/analysis';
import { drawingUploadToolAtom, drawingToolAtom } from 'store/drawing-tool';
import { mapCursorAtom } from 'store/map';

import { useRecoilState, useSetRecoilState } from 'recoil';

import { useUploadFile } from 'hooks/analysis';

import Helper from 'containers/guide/helper';
import DeleteDrawingButton from 'containers/map/delete-drawing-button';

import Icon from 'components/ui/icon';

import UPLOAD_SVG from 'svgs/sidebar/upload.svg?sprite';

const WidgetDrawingUploadTool = () => {
  const [{ enabled: isDrawingUploadToolEnabled, uploadedGeojson }, setDrawingUploadToolState] =
    useRecoilState(drawingUploadToolAtom);

  const [{ enabled: isDrawingToolEnabled, customGeojson }, setDrawingToolState] =
    useRecoilState(drawingToolAtom);

  const setAnalysisState = useSetRecoilState(analysisAtom);
  const setMapCursor = useSetRecoilState(mapCursorAtom);

  const { push, asPath } = useRouter();

  const queryParams = asPath.split('?')[1];

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    multiple: false,
    accept: {
      'multipart/form-data': ['.zip', '.gpkg', '.geojson', '.json'],
    },
  });

  const onUploadFile = useCallback<Parameters<typeof useUploadFile>[1]>(
    (geojson) => {
      setDrawingUploadToolState((drawingToolState) => ({
        ...drawingToolState,
        uploadedGeojson: geojson.data,
        customGeojson: null,
      }));

      setDrawingToolState((drawingToolState) => ({
        ...drawingToolState,
        uploadedGeojson: null,
        customGeojson: null,
      }));

      setAnalysisState((prevAnalysisState) => ({
        ...prevAnalysisState,
        enabled: true,
      }));

      void push(`/custom-area/${queryParams ? `?${queryParams}` : ''}`, null);
    },
    [setDrawingToolState, setAnalysisState, setDrawingUploadToolState, push, queryParams]
  );

  useUploadFile(acceptedFiles?.[0], onUploadFile);

  const { data, isLoading, isError, isInitialLoading, fetchStatus, ...rest } = useUploadFile(
    acceptedFiles?.[0],
    onUploadFile
  );

  useEffect(() => {
    setMapCursor(isDrawingUploadToolEnabled ? 'cell' : 'grab');
  }, [setMapCursor, isDrawingUploadToolEnabled]);

  const conditionalProps =
    (!uploadedGeojson && !!customGeojson) || !isDrawingToolEnabled ? { ...getRootProps() } : {};

  return (
    <Helper
      className={{
        button: 'top-1 right-9',
        tooltip: 'w-fit-content',
        active: 'max-w-[454px]',
      }}
      tooltipPosition={{ top: -100, left: -100 }}
      message="use this to upload an existing GIS file"
    >
      <>
        {(!customGeojson || !isDrawingToolEnabled) && (
          <div
            {...conditionalProps}
            className={cn({
              'w-[128px] cursor-pointer rounded-3xl p-2': true,
              hidden: !!uploadedGeojson,
              'cursor-default opacity-30': !!customGeojson || isDrawingToolEnabled,
            })}
          >
            <input
              data-testid="shapefile-upload"
              {...getInputProps()}
              disabled={isDrawingToolEnabled || !!customGeojson || !!uploadedGeojson}
            />
            <div className="flex flex-col items-center space-y-1">
              <Icon
                icon={UPLOAD_SVG}
                className={cn({
                  'h-8 w-8 fill-current text-white': true,
                })}
                description="Upload"
              />
            </div>
            {!isInitialLoading && (
              <label id="label-file-upload" htmlFor="input-file-upload">
                <p className="whitespace-nowrap font-sans text-sm text-white">Upload shapefile</p>
              </label>
            )}
            {isInitialLoading && fetchStatus === 'fetching' && (
              <label id="label-file-upload" htmlFor="input-file-upload">
                <p className="whitespace-nowrap font-sans text-sm text-white">...uploading</p>
              </label>
            )}
          </div>
        )}
        {(uploadedGeojson || isDrawingUploadToolEnabled) && (
          <div className="mb-2 w-[128px] cursor-pointer rounded-3xl bg-white p-2">
            <DeleteDrawingButton size="sm">
              <p className="whitespace-nowrap font-sans text-sm text-brand-800">Delete area</p>
            </DeleteDrawingButton>
          </div>
        )}
      </>
    </Helper>
    // TO - DO - add when error gets defined
    //   </div>

    //   <div className="block text-sm">
    //     Learn more about{' '}
    //     <Dialog>
    //       <DialogTrigger>
    //         <span className="text-brand-800 underline">supported file formats</span>
    //       </DialogTrigger>
    //       <DialogContent className="top-24 rounded-3xl px-10">
    //         <div className="space-y-4">
    //           <h3 className="font-bold">Analysis of a custom area:</h3>
    //           <span className="text-lg">Upload a custom shape</span>
    //           <h3 className="font-bold">Analysis:</h3>
    //           <p className="text-lg">
    //             Be aware to upload a minimum size area in order to ensure enough data for the
    //             analysis. The recommended maximum file size is 10MB. Anything larger than that may
    //             not work properly.
    //           </p>
    //           <h3 className="font-bold">List of supported file formats:</h3>
    //           <ul className="list-disc pl-5">
    //             <li>
    //               <a
    //                 className="text-sm text-brand-800 hover:underline"
    //                 href="https://geojson.org"
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //               >
    //                 geoJSON (.json, .geojson)
    //               </a>
    //             </li>
    //             <li>
    //               <a
    //                 className="text-sm text-brand-800 hover:underline"
    //                 href="https://www.geopackage.org/"
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //               >
    //                 geoPackage (.gpkg)
    //               </a>
    //             </li>
    //             <li>
    //               <a
    //                 className="text-sm text-brand-800 hover:underline"
    //                 href="https://doc.arcgis.com/en/arcgis-online/reference/shapefiles.htm"
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //               >
    //                 .zip with the following file formats .shp, .shx, .dbf and .prj
    //               </a>
    //             </li>
    //           </ul>
    //         </div>
    //         <DialogClose />
    //       </DialogContent>
    //     </Dialog>
    //     <span className="block text-sm">
    //       By uploading data you agree to the{' '}
    //       <a className="text-brand-800 underline" href="">
    //         Terms of Service
    //       </a>
    //     </span>
    //   </div>
    // </div>
  );
};

export default WidgetDrawingUploadTool;
