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
import LocationDialogContent from 'containers/location-dialog-content';

import { Dialog, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import AREA_SVG from 'svgs/sidebar/area.svg?sprite';
import GLASS_SVG from 'svgs/sidebar/glass.svg?sprite';
import GLOBE_SVG from 'svgs/sidebar/globe.svg?sprite';

import { STYLES } from '../constants';

const MANGROVES_SKIP_ANALYSIS_ALERT = 'MANGROVES_SKIP_ANALYSIS_ALERT';

const Place = () => {
  const [{ enabled: isAnalysisEnabled }] = useRecoilState(analysisAtom);
  const [placeSection, savePlaceSection] = useRecoilState(placeSectionAtom);
  const [locationsModalIsOpen, setLocationsModalIsOpen] = useRecoilState(locationsModalAtom);
  const [isAnalysisAlertOpen, setAnalysisAlert] = useRecoilState(analysisAlertAtom);
  const [skipAnalysisAlert, setSkipAnalysisAlert] = useRecoilState(skipAnalysisAlertAtom);

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

  const openAnalysisAlertModal = useCallback(() => {
    setAnalysisAlert(true);
    openLocationsModal();
  }, [setAnalysisAlert, openLocationsModal]);

  useEffect(() => {
    setSkipAnalysisAlert(window.localStorage.getItem(MANGROVES_SKIP_ANALYSIS_ALERT) === 'true');
  }, [setSkipAnalysisAlert]);

  const handleOnClickWorldwide = useCallback(() => {
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
              'bg-brand-800 fill-current text-white': placeSection === 'worldwide',
              'fill-current text-brand-800': placeSection !== 'worldwide',
            })}
          />
        </button>
        <Dialog open={placeSection === 'search' && locationsModalIsOpen}>
          <DialogTrigger asChild>
            <button
              onClick={handleOnClickSearch}
              className="flex cursor-pointer items-center justify-center rounded-full"
            >
              <Icon
                icon={GLASS_SVG}
                className={cn({
                  'h-9 w-9 rounded-full p-1': true,
                  'bg-brand-800 fill-current text-white': placeSection === 'search',
                  'fill-current text-brand-800': placeSection !== 'search',
                })}
              />
            </button>
          </DialogTrigger>

          <LocationDialogContent close={closeMenu} />
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
              'bg-brand-800 fill-current text-white': placeSection === 'area',
              'fill-current text-brand-800': placeSection !== 'area',
            })}
          />
        </button>
      </div>
      <AnalysisAlert />
    </div>
  );
};

export default Place;
