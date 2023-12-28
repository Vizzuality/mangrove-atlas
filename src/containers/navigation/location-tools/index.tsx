import { useCallback, useEffect, useMemo } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { analysisAlertAtom, analysisAtom, skipAnalysisAlertAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';
import { locationsModalAtom } from 'store/locations';
import { mapCursorAtom } from 'store/map';
import { mapSettingsAtom } from 'store/map-settings';
import { printModeState } from 'store/print-mode';
import { placeSectionAtom } from 'store/sidebar';

import { useRecoilState, useSetRecoilState, useResetRecoilState, useRecoilValue } from 'recoil';

import AnalysisAlert from 'containers/alert';
import Helper from 'containers/guide/helper';
import LocationDialogContent from 'containers/location-dialog-content';

import { Dialog, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import AREA_SVG from 'svgs/sidebar/area.svg?sprite';
import GLASS_SVG from 'svgs/sidebar/glass.svg?sprite';
import UPLOAD_SVG from 'svgs/sidebar/upload.svg?sprite';

const MANGROVES_SKIP_ANALYSIS_ALERT = 'MANGROVES_SKIP_ANALYSIS_ALERT';

const LocationTools = () => {
  const [{ enabled: isAnalysisEnabled }] = useRecoilState(analysisAtom);
  const [placeSection, savePlaceSection] = useRecoilState(placeSectionAtom);
  const [locationsModalIsOpen, setLocationsModalIsOpen] = useRecoilState(locationsModalAtom);
  const [isAnalysisAlertOpen, setAnalysisAlert] = useRecoilState(analysisAlertAtom);
  const [skipAnalysisAlert, setSkipAnalysisAlert] = useRecoilState(skipAnalysisAlertAtom);
  const setMapViewState = useSetRecoilState(mapSettingsAtom);

  const setDrawingToolState = useSetRecoilState(drawingToolAtom);
  const resetAnalysisState = useResetRecoilState(analysisAtom);
  const resetDrawingState = useResetRecoilState(drawingToolAtom);
  const resetMapCursor = useResetRecoilState(mapCursorAtom);

  const isPrintingMode = useRecoilValue(printModeState);
  const isPrintingId = isPrintingMode ? 'print-mode' : 'no-print';

  const { [`default-desktop-${isPrintingId}`]: map } = useMap();
  const resetMapSettingsState = useResetRecoilState(mapSettingsAtom);
  const { asPath, replace } = useRouter();

  const queryParams = useMemo(() => asPath.split('?')[1], [asPath]);

  const openLocationsModal = useCallback(() => {
    if (!locationsModalIsOpen) setLocationsModalIsOpen(true);
  }, [locationsModalIsOpen, setLocationsModalIsOpen]);

  const closeMenu = useCallback(() => {
    if (!isAnalysisAlertOpen) {
      setLocationsModalIsOpen(false);
      savePlaceSection(null);
    }
  }, [isAnalysisAlertOpen, setLocationsModalIsOpen, savePlaceSection]);

  const handleWorldwideView = useCallback(() => {
    resetDrawingState();
    resetAnalysisState();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    replace(`/?${queryParams}`, null);

    map.flyTo({
      center: [0, 20],
      zoom: 2,
    });
  }, [map, resetAnalysisState, resetDrawingState, replace, queryParams]);

  const handleDrawingToolView = useCallback(() => {
    setDrawingToolState((drawingToolState) => ({
      ...drawingToolState,
      showWidget: true,
      enabled: false,
    }));

    resetAnalysisState();
    resetMapSettingsState();
    resetMapCursor();
    savePlaceSection('area');

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    replace(`/custom-area${queryParams ? `?${queryParams}` : ''}`, null);
  }, [
    setDrawingToolState,
    resetAnalysisState,
    resetMapCursor,
    replace,
    queryParams,
    savePlaceSection,
    resetMapSettingsState,
  ]);

  const handleUploadToolView = useCallback(() => {
    resetAnalysisState();
    resetMapSettingsState();
    resetMapCursor();
    savePlaceSection('upload');

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    replace(`/custom-area${queryParams ? `?${queryParams}` : ''}`, null);
  }, [
    resetAnalysisState,
    resetMapCursor,
    replace,
    queryParams,
    savePlaceSection,
    resetMapSettingsState,
  ]);

  const openAnalysisAlertModal = useCallback(() => {
    setAnalysisAlert(true);
    openLocationsModal();
  }, [setAnalysisAlert, openLocationsModal]);

  useEffect(() => {
    setSkipAnalysisAlert(window.localStorage.getItem(MANGROVES_SKIP_ANALYSIS_ALERT) === 'true');
  }, [setSkipAnalysisAlert]);

  const handleOnClickWorldwide = useCallback(() => {
    setMapViewState(false);
    if (isAnalysisEnabled && !skipAnalysisAlert) {
      openAnalysisAlertModal();
    } else {
      handleWorldwideView();
    }
    savePlaceSection('worldwide');
  }, [
    handleWorldwideView,
    isAnalysisEnabled,
    skipAnalysisAlert,
    openAnalysisAlertModal,
    savePlaceSection,
    setMapViewState,
  ]);

  const handleOnClickSearch = useCallback(() => {
    if (isAnalysisEnabled && !skipAnalysisAlert) {
      openAnalysisAlertModal();
    } else {
      openLocationsModal();
    }
    savePlaceSection('search');
  }, [
    openLocationsModal,
    isAnalysisEnabled,
    skipAnalysisAlert,
    openAnalysisAlertModal,
    savePlaceSection,
  ]);

  return (
    <div className="flex space-y-2 text-center">
      <div className="mx-auto flex space-x-8">
        {/* //*FIND LOCATIONS* */}
        <Dialog open={placeSection === 'search' && locationsModalIsOpen}>
          <DialogTrigger asChild>
            <button
              onClick={handleOnClickSearch}
              className="flex w-28 cursor-pointer items-center justify-center"
              data-testid="search-button"
            >
              <Helper
                className={{
                  button: '-bottom-3.5 left-7 z-[20]',
                  tooltip: 'w-fit-content',
                }}
                tooltipPosition={{ top: -40, left: -50 }}
                message="use this button to search for a country or a protected area. Countries can also be selected by clicking on the map or on the name of the area selected (on top of the widgets)"
              >
                <div className="flex flex-col items-center space-y-1">
                  <Icon
                    icon={GLASS_SVG}
                    className={cn({
                      'h-8 w-8 fill-current text-white': true,
                    })}
                    description="Glass"
                  />
                  <p className="whitespace-nowrap font-sans text-sm text-white">Find locations</p>
                </div>
              </Helper>
            </button>
          </DialogTrigger>

          <LocationDialogContent close={closeMenu} />
        </Dialog>
        {/* //*DRAW AREA* */}
        <button
          type="button"
          className="flex w-28 cursor-pointer items-center justify-center"
          onClick={handleDrawingToolView}
          data-testid="drawing-tool-button"
        >
          <Helper
            className={{
              button: '-bottom-3.5 left-7 z-[20]',
              tooltip: 'w-fit-content',
            }}
            tooltipPosition={{ top: -40, left: -50 }}
            message="use this function to calculate statistics for your own custom area of interest"
          >
            <div className="flex flex-col items-center space-y-1">
              <Icon
                icon={AREA_SVG}
                className={cn({
                  'h-8 w-8 rounded-full fill-current text-white': true,
                })}
                description="Area"
              />
              <p className="whitespace-nowrap font-sans text-sm text-white">Draw area</p>
            </div>
          </Helper>
        </button>

        {/* //*UPLOAD SHAPEFILE* */}
        <Helper
          className={{
            button: '-bottom-3.5 -right-1.5 z-[20]',
            tooltip: 'w-fit-content',
          }}
          tooltipPosition={{ top: -40, left: -50 }}
          message="use this button to go back to the worldwide overview"
        >
          <button
            type="button"
            className="flex w-28 cursor-pointer items-center justify-center"
            onClick={handleUploadToolView}
            data-testid="worldwide-button"
          >
            <div className="flex flex-col items-center space-y-1">
              <Icon
                icon={UPLOAD_SVG}
                className={cn({
                  'h-8 w-8 fill-current text-white': true,
                })}
                description="Upload"
              />
              <p className="whitespace-nowrap font-sans text-sm text-white">Upload shapefile</p>
            </div>
          </button>
        </Helper>
      </div>
      <AnalysisAlert />
    </div>
  );
};

export default LocationTools;
