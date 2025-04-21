import { useCallback, useEffect } from 'react';

import { useRecoilState, useRecoilValue } from 'recoil';

import { Dialog, DialogTrigger } from 'components/ui/dialog';
import Icon from 'components/ui/icon';
import Helper from 'containers/help/helper';
import LocationDialogContent from 'containers/location-dialog-content';
import cn from 'lib/classnames';
import { analysisAlertAtom, analysisAtom, skipAnalysisAlertAtom } from 'store/analysis';
import { activeGuideAtom } from 'store/guide';
import { locationsModalAtom } from 'store/locations';
import { locationToolAtom } from 'store/sidebar';
import GLASS_SVG from 'svgs/sidebar/glass.svg?sprite';

const MANGROVES_SKIP_ANALYSIS_ALERT = 'MANGROVES_SKIP_ANALYSIS_ALERT';

const FindLocations = () => {
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
    <Dialog open={locationTool === 'search' && locationsModalIsOpen}>
      <DialogTrigger asChild>
        <>
          <Helper
            className={{
              button: '-top-1 right-6 z-20',
              tooltip: 'w-fit-content max-w-[400px]',
            }}
            tooltipPosition={{ top: -65, left: -10 }}
            message="use this button to search for a country or a protected area. Countries can also be selected by clicking on the map or on the name of the area selected (on top of the widgets)"
          >
            <button
              onClick={handleOnClickSearch}
              className="rounded-3xlp-2 mb-2 flex cursor-pointer flex-col items-center justify-center space-y-1"
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
              <p className="font-sans text-sm text-white md:whitespace-nowrap">Find locations</p>
            </button>
          </Helper>
        </>
      </DialogTrigger>

      <LocationDialogContent close={closeMenu} />
    </Dialog>
  );
};

export default FindLocations;
