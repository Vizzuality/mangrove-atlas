import { useCallback, useEffect, useMemo, useState } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';
import { mapCursorAtom } from 'store/map';

import { useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil';

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
  const [{ enabled: isAnalysisEnabled }] = useRecoilState(analysisAtom);
  const setDrawingToolState = useSetRecoilState(drawingToolAtom);
  const resetAnalysisState = useResetRecoilState(analysisAtom);
  const resetDrawingState = useResetRecoilState(drawingToolAtom);
  const resetMapCursor = useResetRecoilState(mapCursorAtom);

  const [isOpen, setIsOpen] = useState(false);
  const [isAnalysisAlertOpen, setAnalysisAlert] = useState(false);
  const [skipAnalysisAlert, setSkipAnalysisAlert] = useState(false);
  const [placeOption, savePlaceOption] = useState('worldwide');

  const { ['default-desktop']: map } = useMap();
  const { asPath, replace } = useRouter();

  const queryParams = useMemo(() => asPath.split('?')[1], [asPath]);

  const openMenu = useCallback(() => {
    if (!isOpen) setIsOpen(true);
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleWorldwideView = useCallback(() => {
    resetDrawingState();
    resetAnalysisState();

    replace(`/?${queryParams}`, null);

    map.flyTo({
      center: [0, 20],
      zoom: 2,
    });
  }, [replace, map, queryParams, resetAnalysisState, resetDrawingState]);

  const handleDrawingToolView = useCallback(() => {
    setDrawingToolState((drawingToolState) => ({
      ...drawingToolState,
      showWidget: true,
      enabled: false,
    }));

    resetAnalysisState();
    resetMapCursor();

    replace(`/custom-area${queryParams ? `?${queryParams}` : ''}`, null);
  }, [setDrawingToolState, resetAnalysisState, resetMapCursor, replace, queryParams]);

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

    resetDrawingState();
    resetAnalysisState();

    replace(`/?${queryParams}`, null);

    closeAnalysisAlertModal();
  }, [
    queryParams,
    skipAnalysisAlert,
    replace,
    closeAnalysisAlertModal,
    resetDrawingState,
    resetAnalysisState,
  ]);

  useEffect(() => {
    setSkipAnalysisAlert(window.localStorage.getItem(MANGROVES_SKIP_ANALYSIS_ALERT) === 'true');
  }, []);

  const handleOnClickWorldwide = useCallback(() => {
    if (isAnalysisEnabled && !skipAnalysisAlert) {
      openAnalysisAlertModal();
    } else {
      handleWorldwideView();
    }
    savePlaceOption('worldwide');
  }, [handleWorldwideView, isAnalysisEnabled, skipAnalysisAlert, openAnalysisAlertModal]);

  const handleOnClickSearch = useCallback(() => {
    if (isAnalysisEnabled && !skipAnalysisAlert) {
      openAnalysisAlertModal();
    } else {
      openMenu();
    }
    savePlaceOption('search');
  }, [openMenu, isAnalysisEnabled, skipAnalysisAlert, openAnalysisAlertModal]);

  return (
    <div className="flex flex-col space-y-2 text-center">
      <span className="font-sans text-xxs leading-[10px] text-white">Place</span>
      <div className={`${STYLES['icon-wrapper']} space-y-2.5 rounded-full bg-white pb-1`}>
        <button
          type="button"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full"
          onClick={handleOnClickWorldwide}
        >
          <Icon
            icon={GLOBE_SVG}
            className={cn({
              'h-9 w-9 rounded-full p-1': true,
              'bg-brand-800 fill-current text-white': placeOption === 'worldwide',
              'fill-current text-brand-800': placeOption !== 'worldwide',
            })}
          />
        </button>
        <Dialog open={isOpen}>
          <DialogTrigger asChild>
            <button
              onClick={handleOnClickSearch}
              className="flex cursor-pointer items-center justify-center rounded-full"
            >
              <Icon
                icon={GLASS_SVG}
                className={cn({
                  'h-9 w-9 rounded-full p-1': true,
                  'bg-brand-800 fill-current text-white': placeOption === 'search',
                  'fill-current text-brand-800': placeOption !== 'search',
                })}
              />
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
          <Icon
            icon={AREA_SVG}
            className={cn({
              'h-9 w-9 rounded-full p-1': true,
              'bg-brand-800 fill-current text-white': placeOption === 'area',
              'fill-current text-brand-800': placeOption !== 'area',
            })}
          />
        </button>
      </div>
      <Dialog open={isAnalysisAlertOpen}>
        <DialogContent
          className="space-y-5 rounded-[20px] p-10 md:left-auto"
          onEscapeKeyDown={closeAnalysisAlertModal}
          onInteractOutside={closeAnalysisAlertModal}
        >
          <div className="space-y-5">
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
