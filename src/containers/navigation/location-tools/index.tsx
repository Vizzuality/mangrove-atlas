import { useCallback, useEffect } from 'react';

import cn from 'lib/classnames';

import { analysisAlertAtom, analysisAtom, skipAnalysisAlertAtom } from 'store/analysis';
import { activeGuideAtom } from 'store/guide';
import { locationsModalAtom } from 'store/locations';
import { locationToolAtom } from 'store/sidebar';

import { useRecoilState, useRecoilValue } from 'recoil';

import WidgetDrawingTool from 'containers/datasets/drawing-tool';
import WidgetDrawingUploadTool from 'containers/datasets/drawing-upload-tool';
import Helper from 'containers/guide/helper';
import LocationDialogContent from 'containers/location-dialog-content';

import { Dialog, DialogTrigger } from 'components/ui/dialog';
import Icon from 'components/ui/icon';

import GLASS_SVG from 'svgs/sidebar/glass.svg?sprite';

const MANGROVES_SKIP_ANALYSIS_ALERT = 'MANGROVES_SKIP_ANALYSIS_ALERT';

const LocationTools = () => {
  const [{ enabled: isAnalysisEnabled }] = useRecoilState(analysisAtom);
  const [locationTool, saveLocationTool] = useRecoilState(locationToolAtom);
  const [locationsModalIsOpen, setLocationsModalIsOpen] = useRecoilState(locationsModalAtom);
  const [isAnalysisAlertOpen, setAnalysisAlert] = useRecoilState(analysisAlertAtom);
  const [skipAnalysisAlert, setSkipAnalysisAlert] = useRecoilState(skipAnalysisAlertAtom);
  const guideIsActive = useRecoilValue(activeGuideAtom);

  const openLocationsModal = useCallback(() => {
    if (!locationsModalIsOpen) setLocationsModalIsOpen(true);
  }, [locationsModalIsOpen, setLocationsModalIsOpen]);

  const closeMenu = useCallback(() => {
    if (!isAnalysisAlertOpen) {
      setLocationsModalIsOpen(false);
      saveLocationTool(null);
    }
  }, [isAnalysisAlertOpen, setLocationsModalIsOpen, saveLocationTool]);

  const openAnalysisAlertModal = useCallback(() => {
    setAnalysisAlert(true);
    openLocationsModal();
  }, [setAnalysisAlert, openLocationsModal]);

  useEffect(() => {
    setSkipAnalysisAlert(window.localStorage.getItem(MANGROVES_SKIP_ANALYSIS_ALERT) === 'true');
  }, [setSkipAnalysisAlert]);

  const handleOnClickSearch = useCallback(() => {
    saveLocationTool('search');

    if (isAnalysisEnabled && !skipAnalysisAlert) {
      openAnalysisAlertModal();
    } else {
      openLocationsModal();
    }
  }, [
    openLocationsModal,
    isAnalysisEnabled,
    skipAnalysisAlert,
    openAnalysisAlertModal,
    saveLocationTool,
  ]);

  return (
    <div className="mx-auto flex w-full items-center justify-center space-x-2 md:space-x-8">
      {/* //*FIND LOCATIONS* */}
      <Dialog open={locationTool === 'search' && locationsModalIsOpen}>
        <DialogTrigger asChild>
          <>
            <Helper
              className={{
                button: 'top-1 right-9 z-20',
                tooltip: 'w-fit-content max-w-[400px]',
              }}
              tooltipPosition={{ top: -65, left: -10 }}
              message="use this button to search for a country or a protected area. Countries can also be selected by clicking on the map or on the name of the area selected (on top of the widgets)"
            >
              <button
                onClick={handleOnClickSearch}
                className="mb-2 flex w-[128px] cursor-pointer flex-col items-center justify-center space-y-1 rounded-3xl p-2"
                data-testid="search-button"
                disabled={guideIsActive}
              >
                <Icon
                  icon={GLASS_SVG}
                  className={cn({
                    'h-8 w-8 fill-current text-white': true,
                  })}
                  description="Glass"
                />
                <p className="whitespace-nowrap font-sans text-sm text-white">Find locations</p>
              </button>
            </Helper>
          </>
        </DialogTrigger>

        <LocationDialogContent close={closeMenu} />
      </Dialog>

      {/* //*DRAW AREA* */}

      <WidgetDrawingTool />

      {/* //*UPLOAD SHAPEFILE* */}
      <WidgetDrawingUploadTool />
    </div>
  );
};

export default LocationTools;
