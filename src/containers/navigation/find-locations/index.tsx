import { useCallback, useEffect } from 'react';

import { analysisAlertAtom, analysisAtom, skipAnalysisAlertAtom } from '@/store/analysis';
import { locationsModalAtom } from '@/store/locations';
import { locationToolAtom } from '@/store/sidebar';

import { useRecoilState } from 'recoil';

import Helper from '@/containers/help/helper';
import LocationDialogContent from '@/containers/location-dialog-content';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import GLASS_SVG from '@/svgs/sidebar/glass';

const MANGROVES_SKIP_ANALYSIS_ALERT = 'MANGROVES_SKIP_ANALYSIS_ALERT';

const FindLocations = ({ menuItemStyle }: { menuItemStyle?: string }) => {
  const [{ enabled: isAnalysisEnabled }] = useRecoilState(analysisAtom);
  const [locationTool, saveLocationTool] = useRecoilState(locationToolAtom);
  const [locationsModalIsOpen, setLocationsModalIsOpen] = useRecoilState(locationsModalAtom);
  const [isAnalysisAlertOpen, setAnalysisAlert] = useRecoilState(analysisAlertAtom);
  const [skipAnalysisAlert, setSkipAnalysisAlert] = useRecoilState(skipAnalysisAlertAtom);

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
      <Helper
        className={{
          button: '-top-1 right-4 z-20',
          tooltip: 'w-fit-content max-w-[400px]',
        }}
        tooltipPosition={{ top: -65, left: -5 }}
        message="Click this icon to search for a country or a protected area. Countries can also be selected by clicking on the map or on the selected geography seen in the blue space above. "
      >
        <DialogTrigger asChild>
          <button
            onClick={handleOnClickSearch}
            className="mb-2 flex cursor-pointer flex-col items-center justify-center space-y-1 rounded-3xl p-2"
            data-testid="search-button"
          >
            <GLASS_SVG role="img" title="Glass" />
            <p className="font-sans text-sm text-white md:whitespace-nowrap">Find locations</p>
          </button>
        </DialogTrigger>
      </Helper>

      <LocationDialogContent close={closeMenu} />
    </Dialog>
  );
};

export default FindLocations;
