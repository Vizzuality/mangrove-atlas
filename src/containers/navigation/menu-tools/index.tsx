import { useCallback, useEffect } from 'react';

import { useMap } from 'react-map-gl';

import Link from 'next/link';

import { analysisAtom, skipAnalysisAlertAtom } from 'store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';

import { BiReset } from 'react-icons/bi';
import { useRecoilState, useResetRecoilState } from 'recoil';

import WidgetDrawingTool from 'containers/datasets/drawing-tool';
import WidgetDrawingUploadTool from 'containers/datasets/drawing-upload-tool';
import FindLocations from 'containers/navigation/find-locations';

const MANGROVES_SKIP_ANALYSIS_ALERT = 'MANGROVES_SKIP_ANALYSIS_ALERT';

const LocationTools = () => {
  const [, setSkipAnalysisAlert] = useRecoilState(skipAnalysisAlertAtom);
  const resetAnalysisState = useResetRecoilState(analysisAtom);
  const resetDrawingState = useResetRecoilState(drawingToolAtom);
  const resetDrawingUploadState = useResetRecoilState(drawingUploadToolAtom);

  const map = useMap();

  useEffect(() => {
    setSkipAnalysisAlert(window.localStorage.getItem(MANGROVES_SKIP_ANALYSIS_ALERT) === 'true');
  }, [setSkipAnalysisAlert]);

  const handleReset = useCallback(() => {
    resetDrawingState();
    resetAnalysisState();
    resetDrawingUploadState();
    if (map) {
      map?.['default-desktop-no-print'].flyTo({
        center: [0, 20],
        zoom: 2,
      });
    }
  }, [map, resetAnalysisState, resetDrawingState, resetDrawingUploadState]);

  return (
    <div className="mx-4 flex w-full items-center justify-center space-x-6 md:mx-auto">
      {/* RESET PAGE */}
      <Link
        href="/"
        onClick={handleReset}
        className="mb-2 flex cursor-pointer flex-col items-center justify-center space-y-1 rounded-3xl py-2 text-white"
      >
        <BiReset className="h-8 w-8 fill-current" />
        <span className="whitespace-nowrap font-sans text-sm">Reset page</span>
      </Link>

      {/* FIND LOCATIONS */}
      <FindLocations />

      {/* DRAW AREA */}
      <WidgetDrawingTool />

      {/* UPLOAD SHAPEFILE */}
      <WidgetDrawingUploadTool />
    </div>
  );
};

export default LocationTools;
