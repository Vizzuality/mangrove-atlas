import { useCallback, useMemo } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter } from 'next/router';

import { analysisAlertAtom, analysisAtom, skipAnalysisAlertAtom } from 'store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';
import { locationsModalAtom } from 'store/locations';
import { locationToolAtom } from 'store/sidebar';

import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';

import { Dialog, DialogPortal, DialogContent } from 'components/ui/dialog';
import Icon from 'components/ui/icon';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite';

const MANGROVES_SKIP_ANALYSIS_ALERT = 'MANGROVES_SKIP_ANALYSIS_ALERT';

const AnalysisAlert = () => {
  const { asPath, replace } = useRouter();

  const locationTool = useRecoilValue(locationToolAtom);
  const setLocationsModalIsOpen = useSetRecoilState(locationsModalAtom);
  const [isAnalysisAlertOpen, setAnalysisAlert] = useRecoilState(analysisAlertAtom);
  const [skipAnalysisAlert, setSkipAnalysisAlert] = useRecoilState(skipAnalysisAlertAtom);
  const resetAnalysisState = useResetRecoilState(analysisAtom);
  const resetDrawingState = useResetRecoilState(drawingToolAtom);
  const resetDrawingUploadState = useResetRecoilState(drawingUploadToolAtom);

  const queryParams = useMemo(() => asPath.split('?')[1], [asPath]);

  const { [`default-desktop`]: map } = useMap();

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

    if (locationTool === 'worldwide') {
      handleWorldwideView();
    }

    resetDrawingState();
    resetAnalysisState();
    resetDrawingUploadState();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    replace(`/?${queryParams}`, null);

    setAnalysisAlert(false);
  }, [
    locationTool,
    queryParams,
    replace,
    resetDrawingState,
    resetDrawingUploadState,
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
        <DialogPortal>
          <DialogContent onEscapeKeyDown={() => setAnalysisAlert(false)} overlay>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setAnalysisAlert(false)}
                aria-label="Reset analysis"
              >
                <Icon icon={CLOSE_SVG} className="absolute right-8 h-8 w-8" description="Close" />
              </button>
            </div>
            <div className="flex flex-col space-y-5">
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

              <div className="flex items-center justify-center space-x-5">
                <button
                  aria-label="Cancel reset page"
                  type="button"
                  onClick={handleCancelResetPage}
                  className="rounded-2xl border-2 border-brand-800/20 px-6 py-[1px] text-sm text-brand-800"
                >
                  Cancel
                </button>
                <button
                  aria-label="Reset page"
                  type="button"
                  onClick={handleResetPage}
                  className="rounded-2xl bg-brand-800 px-6 py-[2px] text-sm text-white"
                >
                  Reset page
                </button>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};

export default AnalysisAlert;
