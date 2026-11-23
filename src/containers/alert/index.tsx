import { useCallback } from 'react';

import { analysisAlertAtom, analysisAtom, skipAnalysisAlertAtom } from '@/store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { locationsModalAtom } from '@/store/locations';

import { DialogTitle } from '@radix-ui/react-dialog';
import { useAtom, useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';

import { useLocationNavigation } from 'hooks/location-navigation';

import { Dialog, DialogPortal, DialogContent } from '@/components/ui/dialog';

import CLOSE_SVG from '@/svgs/ui/close';

const MANGROVES_SKIP_ANALYSIS_ALERT = 'MANGROVES_SKIP_ANALYSIS_ALERT';

const AnalysisAlert = () => {
  const setLocationsModalIsOpen = useSetAtom(locationsModalAtom);
  const [isAnalysisAlertOpen, setAnalysisAlert] = useAtom(analysisAlertAtom);
  const [skipAnalysisAlert, setSkipAnalysisAlert] = useAtom(skipAnalysisAlertAtom);
  const resetAnalysisState = useResetAtom(analysisAtom);
  const resetDrawingState = useResetAtom(drawingToolAtom);
  const resetDrawingUploadState = useResetAtom(drawingUploadToolAtom);

  const { navigate } = useLocationNavigation();

  const handleCancelResetPage = useCallback(() => {
    setAnalysisAlert(false);
    setLocationsModalIsOpen(false);
  }, [setAnalysisAlert, setLocationsModalIsOpen]);

  const handleResetPage = useCallback(() => {
    if (skipAnalysisAlert) {
      window.localStorage.setItem(MANGROVES_SKIP_ANALYSIS_ALERT, String(skipAnalysisAlert));
    }

    resetDrawingState();
    resetAnalysisState();
    resetDrawingUploadState();

    // Same client-side nav the rest of the app uses: sets the worldwide
    // camera target (the map flies and rewrites `bounds`) and goes to `/`.
    navigate({ type: 'worldwide' });

    setAnalysisAlert(false);
  }, [
    navigate,
    resetDrawingState,
    resetDrawingUploadState,
    resetAnalysisState,
    setAnalysisAlert,
    skipAnalysisAlert,
  ]);

  const handleCheckbox = useCallback(() => {
    setSkipAnalysisAlert(!skipAnalysisAlert);
  }, [skipAnalysisAlert, setSkipAnalysisAlert]);

  return (
    <>
      <Dialog open={isAnalysisAlertOpen} onOpenChange={(open) => !open && setAnalysisAlert(false)}>
        <DialogPortal>
          <DialogContent onEscapeKeyDown={() => setAnalysisAlert(false)} overlay>
            <DialogTitle className="sr-only">Reset page</DialogTitle>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setAnalysisAlert(false)}
                aria-label="Reset analysis"
              >
                <CLOSE_SVG className="absolute right-8 h-8 w-8 fill-current" aria-hidden="true" />
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
                  <input
                    id="reset-do-not-ask"
                    type="checkbox"
                    name="do-not-ask"
                    onChange={handleCheckbox}
                  />
                  <label htmlFor="reset-do-not-ask">Don&apos;t ask me again.</label>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-5">
                <button
                  aria-label="Cancel reset page"
                  type="button"
                  onClick={handleCancelResetPage}
                  className="border-brand-800/20 text-brand-800 rounded-2xl border-2 px-6 py-px text-sm"
                >
                  Cancel
                </button>
                <button
                  aria-label="Reset page"
                  type="button"
                  onClick={handleResetPage}
                  className="bg-brand-800 rounded-2xl px-6 py-[2px] text-sm text-white"
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
