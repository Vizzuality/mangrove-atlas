import { useCallback, useMemo } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter } from 'next/router';

import { analysisAlertAtom, analysisAtom, skipAnalysisAlertAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';
import { locationsModalAtom } from 'store/locations';
import { printModeState } from 'store/print-mode';
import { placeSectionAtom } from 'store/sidebar';

import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';

import { Dialog, DialogPortal, DialogContent } from 'components/dialog';
import Icon from 'components/icon';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite';

const MANGROVES_SKIP_ANALYSIS_ALERT = 'MANGROVES_SKIP_ANALYSIS_ALERT';

const AnalysisAlert = () => {
  const { asPath, replace } = useRouter();

  const placeSection = useRecoilValue(placeSectionAtom);
  const isPrintingMode = useRecoilValue(printModeState);
  const setLocationsModalIsOpen = useSetRecoilState(locationsModalAtom);
  const [isAnalysisAlertOpen, setAnalysisAlert] = useRecoilState(analysisAlertAtom);
  const [skipAnalysisAlert, setSkipAnalysisAlert] = useRecoilState(skipAnalysisAlertAtom);
  const resetAnalysisState = useResetRecoilState(analysisAtom);
  const resetDrawingState = useResetRecoilState(drawingToolAtom);

  const queryParams = useMemo(() => asPath.split('?')[1], [asPath]);

  const isPrintingId = isPrintingMode ? 'print-mode' : 'no-print';
  const { [`default-desktop-${isPrintingId}`]: map } = useMap();

  const handleCancelResetPage = useCallback(() => {
    setAnalysisAlert(false);
    setLocationsModalIsOpen(false);
  }, [setAnalysisAlert, setLocationsModalIsOpen]);

  const handleWorldwideView = useCallback(() => {
    resetDrawingState();
    resetAnalysisState();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    replace(`/?${queryParams}`, null);

    map.flyTo({
      center: [0, 20],
      zoom: 2,
    });
  }, [replace, map, queryParams, resetAnalysisState, resetDrawingState]);

  const handleResetPage = useCallback(() => {
    if (skipAnalysisAlert) {
      window.localStorage.setItem(MANGROVES_SKIP_ANALYSIS_ALERT, String(skipAnalysisAlert));
    }

    if (placeSection === 'worldwide') {
      handleWorldwideView();
    }

    resetDrawingState();
    resetAnalysisState();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    replace(`/?${queryParams}`, null);

    setAnalysisAlert(false);
  }, [
    placeSection,
    queryParams,
    replace,
    resetDrawingState,
    resetAnalysisState,
    setAnalysisAlert,
    handleWorldwideView,
    skipAnalysisAlert,
  ]);

  const handleCheckbox = useCallback(() => {
    setSkipAnalysisAlert(!skipAnalysisAlert);
  }, [skipAnalysisAlert, setSkipAnalysisAlert]);

  return (
    <>
      <Dialog open={isAnalysisAlertOpen}>
        <DialogPortal className="z-50">
          <DialogContent
            className="space-y-5 rounded-3xl p-10 md:left-auto"
            onEscapeKeyDown={() => setAnalysisAlert(false)}
          >
            <div className="space-y-5">
              <div className="flex justify-end">
                <button type="button" onClick={() => setAnalysisAlert(false)}>
                  <Icon icon={CLOSE_SVG} className="h-8 w-8" />
                </button>
              </div>
              <h3 className="text-3xl">Reset the page and delete area</h3>
              <div className="space-y-2">
                <p>
                  If you reset the page,{' '}
                  <span className="font-semibold">your custom area will be deleted</span>. Are you
                  sure that you want to reset the page?
                </p>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" name="do-not-ask" onChange={handleCheckbox} />
                  <label htmlFor="modal">Don&apos;t ask me again.</label>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-5">
              <button
                type="button"
                onClick={handleCancelResetPage}
                className="rounded-2xl border-2 border-brand-800/20 px-6 py-[1px] text-sm text-brand-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetPage}
                className="rounded-2xl bg-brand-800 px-6 py-[2px] text-sm text-white"
              >
                Reset page
              </button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};

export default AnalysisAlert;
