import { useCallback, useEffect } from 'react';

import { useMap } from 'react-map-gl';

import Link from 'next/link';

import { analysisAtom, skipAnalysisAlertAtom } from '@/store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';

import { useAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';

import WidgetDrawingTool from '@/containers/datasets/drawing-tool';
import WidgetDrawingUploadTool from '@/containers/datasets/drawing-upload-tool';
import Helper from '@/containers/help/helper';
import FindLocations from '@/containers/navigation/find-locations';
import SavedAreas from '@/containers/saved-areas';

const MANGROVES_SKIP_ANALYSIS_ALERT = 'MANGROVES_SKIP_ANALYSIS_ALERT';

import RESET_SVG from '@/svgs/sidebar/reset';

const LocationTools = () => {
  const [, setSkipAnalysisAlert] = useAtom(skipAnalysisAlertAtom);
  const resetAnalysisState = useResetAtom(analysisAtom);
  const resetDrawingState = useResetAtom(drawingToolAtom);
  const resetDrawingUploadState = useResetAtom(drawingUploadToolAtom);

  const map = useMap();

  useEffect(() => {
    setSkipAnalysisAlert(window.localStorage.getItem(MANGROVES_SKIP_ANALYSIS_ALERT) === 'true');
  }, [setSkipAnalysisAlert]);

  const handleReset = useCallback(() => {
    resetDrawingState();
    resetAnalysisState();
    resetDrawingUploadState();
    // The main map registers with react-map-gl as id `default` (see
    // containers/map MapContainer mapId="default"). Chain through that keyed
    // ref — the old `default-desktop-no-print` key matched no mounted map, so
    // flyTo silently no-oped and the map never returned to worldwide.
    map?.['default']?.flyTo({
      center: [0, 20],
      zoom: 2,
    });
  }, [map, resetAnalysisState, resetDrawingState, resetDrawingUploadState]);

  const CARD_MENU_ITEM =
    'flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center space-y-1 rounded-3xl p-1 text-white xs:p-2';

  return (
    <div className="xs:justify-center xs:gap-4 xs:px-4 mb-4 flex w-full items-center justify-between gap-1 overflow-hidden px-2">
      {/* RESET PAGE */}
      <Link href="/" onClick={handleReset} data-testid="worldwide-button">
        <Helper
          className={{
            button: '-top-1 left-0 z-20',
            tooltip: 'w-fit-content max-w-100',
          }}
          tooltipPosition={{ top: -65, left: 0 }}
          message="Click this icon to return to default settings: Global statistics, zoomed out view, and default widget deck."
        >
          <div className={CARD_MENU_ITEM}>
            <RESET_SVG role="img" title="Reset page" />
            <span className="font-sans text-xs whitespace-nowrap lg:text-sm">
              <span className="lg:hidden">Reset</span>
              <span className="hidden lg:inline">Reset page</span>
            </span>
          </div>
        </Helper>
      </Link>

      {/* FIND LOCATIONS */}
      <FindLocations menuItemStyle={CARD_MENU_ITEM} />

      {/* DRAW AREA — shown on mobile but disabled (drawing is unsupported on
          touch/small screens); fully interactive from lg up. */}
      <div className="pointer-events-none opacity-40 lg:pointer-events-auto lg:opacity-100">
        <WidgetDrawingTool menuItemStyle={CARD_MENU_ITEM} />
      </div>

      {/* UPLOAD SHAPEFILE */}
      <WidgetDrawingUploadTool menuItemStyle={CARD_MENU_ITEM} />

      {/* SAVED AREAS */}
      <SavedAreas menuItemStyle={CARD_MENU_ITEM} />
    </div>
  );
};

export default LocationTools;
