import { useEffect, useState } from 'react';

import { useDropzone } from 'react-dropzone';

import cn from '@/lib/classnames';

import { analysisAtom } from '@/store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { mapCursorAtom } from '@/store/map';

import turfBbox from '@turf/bbox';
import { useAtom, useSetAtom } from 'jotai';
import { toast } from 'sonner';

import { fetchUploadFile } from 'hooks/analysis';
import { useLocationNavigation } from 'hooks/location-navigation';

import Helper from '@/containers/help/helper';
import DeleteDrawingButton from '@/containers/map/delete-drawing-button';

import UPLOAD_SVG from '@/svgs/sidebar/upload';

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
    useAtom(drawingUploadToolAtom);

  const [uploadingFile, setFileUpload] = useState(false);

  const [{ enabled: isDrawingToolEnabled, customGeojson }, setDrawingToolState] =
    useAtom(drawingToolAtom);

  const setAnalysisState = useSetAtom(analysisAtom);
  const setMapCursor = useSetAtom(mapCursorAtom);

  const { navigate } = useLocationNavigation();

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

            // Change location to custom-area using the same client-side navigation the
            // draw flow uses (history.replaceState — no RSC refetch/page remount) and fly
            // the map to the uploaded geometry's bounds.
            const uploadedBbox = data?.data
              ? (turfBbox(data.data) as [number, number, number, number])
              : null;
            navigate({ type: 'custom-area' }, uploadedBbox);

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

  // react-dropzone's root gets `tabIndex: 0` and `role: 'presentation'`, i.e. a
  // focusable element with no role and no name — keyboard users land on it and
  // hear nothing. The real <input type="file"> is `display: none`, so its label
  // cannot name anything either. Naming the root as a button is what actually
  // reaches assistive tech.
  const conditionalProps =
    (!uploadedGeojson && !!customGeojson) || !isDrawingToolEnabled
      ? getRootProps({
          role: 'button',
          'aria-label': uploadingFile ? 'Uploading shapefile' : 'Upload shapefile',
        })
      : {};

  return (
    <Helper
      className={{
        button: '-top-1 left-16 z-20',
        tooltip: 'w-fit max-w-100',
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
            {/* The input carried no `id`, so both labels' `htmlFor` pointed at
                nothing and the file input was unlabelled. They also shared one
                `id`, duplicating it in the DOM. There is now a single label
                bound to a real id, with the state in its text. */}
            <input
              id="input-file-upload"
              data-testid="shapefile-upload"
              className="w-full"
              {...getInputProps()}
              disabled={isDrawingToolEnabled || !!customGeojson || !!uploadedGeojson}
            />
            <div className="flex flex-col items-center space-y-1">
              <UPLOAD_SVG aria-hidden="true" />
              <label id="label-file-upload" htmlFor="input-file-upload">
                <p className="font-sans text-xs whitespace-nowrap text-white lg:text-sm">
                  {uploadingFile ? '...uploading' : 'Shapefile'}
                </p>
              </label>
            </div>
          </div>
        )}
        {(uploadedGeojson || isDrawingUploadToolEnabled) && (
          <div className="mb-2 cursor-pointer rounded-3xl bg-white p-2">
            <DeleteDrawingButton size="sm">
              <p className="text-brand-800 font-sans text-sm whitespace-nowrap">Delete area</p>
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
