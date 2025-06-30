import { useEffect, useState } from 'react';

import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';
import { mapCursorAtom } from 'store/map';

import { useRecoilState, useSetRecoilState } from 'recoil';

import { fetchUploadFile } from 'hooks/analysis';

import Helper from 'containers/help/helper';
import DeleteDrawingButton from 'containers/map/delete-drawing-button';

import Icon from 'components/ui/icon';

import UPLOAD_SVG from 'svgs/sidebar/upload.svg?sprite';

const drawingToolHelperContent = (
  <div className="max-w-xs space-y-4 text-sm font-light text-black/85">
    <p>
      Use this function to upload a polygon for which you would like statistics calculated. The
      widgets will update with statistics for this area.
    </p>
    <p>
      Be aware to upload a minimum size area in order to ensure enough data for the analysis. The
      recommended maximum file size is 10MB. Anything larger than that may not work properly.
    </p>
    <h3>Acceptable formats include:</h3>

    <ul className="list-disc pl-5">
      <li>
        <a
          className="text-brand-800 hover:underline"
          href="https://geojson.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          geoJSON (.json, .geojson)
        </a>
      </li>
      <li>
        <a
          className="text-brand-800 hover:underline"
          href="https://www.geopackage.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          geoPackage (.gpkg)
        </a>
      </li>
      <li>
        <a
          className="text-brand-800 hover:underline"
          href="https://doc.arcgis.com/en/arcgis-online/reference/shapefiles.htm"
          target="_blank"
          rel="noopener noreferrer"
        >
          .zip with the following file formats .shp, .shx, .dbf and .prj
        </a>
      </li>
    </ul>
  </div>
);

const WidgetDrawingUploadTool = ({ menuItemStyle }: { menuItemStyle?: string }) => {
  const [{ enabled: isDrawingUploadToolEnabled, uploadedGeojson }, setDrawingUploadToolState] =
    useRecoilState(drawingUploadToolAtom);

  const [uploadingFile, setFileUpload] = useState(false);

  const [{ enabled: isDrawingToolEnabled, customGeojson }, setDrawingToolState] =
    useRecoilState(drawingToolAtom);

  const setAnalysisState = useSetRecoilState(analysisAtom);
  const setMapCursor = useSetRecoilState(mapCursorAtom);

  const { push, asPath } = useRouter();

  const queryParams = asPath.split('?')[1];

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'multipart/form-data': ['.zip', '.gpkg', '.geojson', '.json'],
    },
    onDropAccepted(files) {
      if (files.length > 0) {
        setFileUpload(true);
        fetchUploadFile(files)
          .then((data) => {
            setFileUpload(false);
            setDrawingUploadToolState((drawingToolState) => ({
              ...drawingToolState,
              uploadedGeojson: data?.data,
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

            toast.success('File uploaded successfully');
          })
          .catch((error: Error) => {
            setFileUpload(false);
            toast.error(`Error uploading file: ${error.message}`);
          });
      }
    },
    onDropRejected(fileRejections) {
      fileRejections.forEach(({ errors }) => {
        errors.forEach((error) => {
          toast.error(`Error uploading file: ${error.message}`);
        });
      });
    },
  });

  useEffect(() => {
    setMapCursor(isDrawingUploadToolEnabled ? 'cell' : 'grab');
  }, [setMapCursor, isDrawingUploadToolEnabled]);

  const conditionalProps =
    (!uploadedGeojson && !!customGeojson) || !isDrawingToolEnabled ? { ...getRootProps() } : {};

  return (
    <Helper
      className={{
        button: '-top-1 left-16 z-20',
        tooltip: 'w-fit max-w-[400px]',
      }}
      tooltipPosition={{ top: -65, left: -0 }}
      content={drawingToolHelperContent}
    >
      <div className={menuItemStyle}>
        {(!customGeojson || !isDrawingToolEnabled) && (
          <div
            {...conditionalProps}
            className={cn({
              'flex cursor-pointer flex-col items-center justify-center rounded-3xl': true,
              hidden: !!uploadedGeojson,
              'cursor-default opacity-30': !!customGeojson || isDrawingToolEnabled,
            })}
          >
            <input
              data-testid="shapefile-upload"
              className="w-full"
              {...getInputProps()}
              disabled={isDrawingToolEnabled || !!customGeojson || !!uploadedGeojson}
            />
            <div className="flex flex-col items-center space-y-1">
              <Icon
                icon={UPLOAD_SVG}
                className={cn({
                  'h-8 w-8 fill-current text-green-900': true,
                })}
                description="Upload"
              />
              {!uploadingFile && (
                <label id="label-file-upload" htmlFor="input-file-upload">
                  <p className="whitespace-nowrap font-sans text-sm text-white">Upload shapefile</p>
                </label>
              )}
              {uploadingFile && (
                <label id="label-file-upload" htmlFor="input-file-upload">
                  <p className="whitespace-nowrap font-sans text-sm text-white">...uploading</p>
                </label>
              )}
            </div>
          </div>
        )}
        {(uploadedGeojson || isDrawingUploadToolEnabled) && (
          <div className="mb-2 cursor-pointer rounded-3xl bg-white p-2">
            <DeleteDrawingButton size="sm">
              <p className="whitespace-nowrap font-sans text-sm text-brand-800">Delete area</p>
            </DeleteDrawingButton>
          </div>
        )}
      </div>
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
