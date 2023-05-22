import { useCallback, useEffect, useState } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';

import { useRecoilState, useSetRecoilState } from 'recoil';

import LocationsList from 'containers/locations-list';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/dialog';
import Icon from 'components/icon';

import AREA_SVG from 'svgs/sidebar/area.svg?sprite';
import GLASS_SVG from 'svgs/sidebar/glass.svg?sprite';
import GLOBE_SVG from 'svgs/sidebar/globe.svg?sprite';
import CLOSE_SVG from 'svgs/ui/close.svg?sprite';

import { STYLES } from '../constants';

const MANGROVES_SKIP_ANALYSIS_ALERT = 'MANGROVES_SKIP_ANALYSIS_ALERT';

const Place = () => {
  const setDrawingToolWidget = useSetRecoilState(drawingToolAtom);
  const [{ enabled: isAnalysisEnabled }, setAnalysisState] = useRecoilState(analysisAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalysisAlertOpen, setAnalysisAlert] = useState(false);
  const [skipAnalysisAlert, setSkipAnalysisAlert] = useState(false);

  const { asPath, replace } = useRouter();

  const { ['default-desktop']: map } = useMap();

  const openMenu = useCallback(() => {
    if (!isOpen) setIsOpen(true);
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleWorldwideView = useCallback(async () => {
    const queryParams = asPath.split('?')[1];

    await replace(`/?${queryParams}`, null);

    map.flyTo({
      center: [0, 20],
      zoom: 2,
    });
  }, [asPath, replace, map]);

  const handleDrawingToolView = useCallback(() => {
    setDrawingToolWidget((drawingToolState) => ({
      ...drawingToolState,
      showWidget: true,
      enabled: false,
    }));

    setAnalysisState((prevAnalysisState) => ({
      ...prevAnalysisState,
      enabled: false,
    }));
  }, [setDrawingToolWidget, setAnalysisState]);

  const openAnalysisAlertModal = useCallback(() => {
    setAnalysisAlert(true);
  }, [setAnalysisAlert]);

  const closeAnalysisAlertModal = useCallback(() => {
    setAnalysisAlert(false);
  }, [setAnalysisAlert]);

  const handleCheckbox = useCallback(() => {
    setSkipAnalysisAlert(!skipAnalysisAlert);
  }, [skipAnalysisAlert]);

  const handleResetPage = useCallback(() => {
    if (skipAnalysisAlert) {
      window.localStorage.setItem(MANGROVES_SKIP_ANALYSIS_ALERT, String(skipAnalysisAlert));
    }

    // todo: handle rest of updates (URL change to /, reset analysis and drawing tools states)
    closeAnalysisAlertModal();
  }, [skipAnalysisAlert, closeAnalysisAlertModal]);

  useEffect(() => {
    setSkipAnalysisAlert(window.localStorage.getItem(MANGROVES_SKIP_ANALYSIS_ALERT) === 'true');
  }, []);

  return (
    <div className="flex flex-col space-y-2 text-center">
      <span className="font-sans text-xxs leading-[10px] text-white">Place</span>
      <div className={`${STYLES['icon-wrapper']} space-y-4 rounded-full bg-white py-1`}>
        <button
          type="button"
          className="flex cursor-pointer items-center justify-center rounded-full"
          onClick={
            isAnalysisEnabled && !skipAnalysisAlert ? openAnalysisAlertModal : handleWorldwideView
          }
        >
          <Icon icon={GLOBE_SVG} className="h-8 w-8 fill-current text-brand-800" />
        </button>
        <Dialog open={isOpen}>
          <DialogTrigger asChild>
            <button
              onClick={isAnalysisEnabled && !skipAnalysisAlert ? openAnalysisAlertModal : openMenu}
              className="flex cursor-pointer items-center justify-center rounded-full"
            >
              <Icon icon={GLASS_SVG} className="h-8 w-8 fill-current text-brand-800" />
            </button>
          </DialogTrigger>
          <DialogContent
            className="h-[90vh] w-[540px] rounded-[20px] px-10 pt-10 pb-0"
            onEscapeKeyDown={closeMenu}
            onInteractOutside={closeMenu}
          >
            <LocationsList onSelectLocation={closeMenu} />
            <DialogClose onClose={closeMenu} />
          </DialogContent>
        </Dialog>
        <button
          type="button"
          className={cn({
            'h-10.5 flex w-10.5 cursor-pointer items-center justify-center rounded-full': true,
          })}
          onClick={handleDrawingToolView}
        >
          <Icon icon={AREA_SVG} className="h-8 w-8 fill-current text-brand-800" />
        </button>
      </div>
      <Dialog open={isAnalysisAlertOpen}>
        <DialogContent
          className="space-y-6 rounded-[20px] p-10 md:left-auto"
          onEscapeKeyDown={closeAnalysisAlertModal}
          onInteractOutside={closeAnalysisAlertModal}
        >
          <div className="space-y-6">
            <div className="flex justify-end">
              <button type="button" onClick={closeAnalysisAlertModal}>
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
              onClick={closeAnalysisAlertModal}
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
      </Dialog>
    </div>
  );
};

export default Place;
