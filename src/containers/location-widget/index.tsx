import { useEffect, useState, useRef, useMemo, useCallback } from 'react';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { analysisAlertAtom, analysisAtom, skipAnalysisAlertAtom } from 'store/analysis';
import { activeGuideAtom } from 'store/guide';
import { locationsModalAtom } from 'store/locations';
import { placeSectionAtom } from 'store/sidebar';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import AnalysisAlert from 'containers/alert';
import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';
import Helper from 'containers/guide/helper';
import LocationDialogContent from 'containers/location-dialog-content';
import LocationTools from 'containers/navigation/location-tools';

import { Dialog, DialogTrigger } from 'components/dialog';

const LocationWidget = () => {
  const {
    query: { params },
  } = useRouter();
  const locationType = params?.[0] as LocationTypes;
  const id = params?.[1];
  const {
    data: { name },
  } = useLocation(locationType, id, {
    enabled: (!!locationType && !!id) || locationType !== 'custom-area',
  });

  const [{ enabled: isAnalysisEnabled }] = useRecoilState(analysisAtom);

  const [isAnalysisAlertOpen, setAnalysisAlert] = useRecoilState(analysisAlertAtom);
  const [locationsModalIsOpen, setLocationsModalIsOpen] = useRecoilState(locationsModalAtom);
  const skipAnalysisAlert = useRecoilValue(skipAnalysisAlertAtom);
  const savePlaceSection = useSetRecoilState(placeSectionAtom);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const closeMenu = useCallback(() => {
    if (!isAnalysisAlertOpen) setIsOpen(false);
  }, [isAnalysisAlertOpen]);

  const locationName = useMemo(() => {
    if (locationType === 'custom-area') {
      return 'Custom Area';
    }

    if (locationType) {
      return name;
    }

    return 'Worldwide';
  }, [locationType, name]);

  useEffect(() => {
    const { width } = titleRef?.current?.getBoundingClientRect();
    setWidth(width);
  }, [name]);

  const openLocationsModal = useCallback(() => {
    if (!locationsModalIsOpen) setLocationsModalIsOpen(true);
  }, [locationsModalIsOpen, setLocationsModalIsOpen]);

  const handleOnClickTitle = useCallback(() => {
    if (isAnalysisEnabled && !skipAnalysisAlert) {
      setAnalysisAlert(true);
      openLocationsModal();
    } else {
      openLocationsModal();
    }
    savePlaceSection('search');
  }, [
    openLocationsModal,
    isAnalysisEnabled,
    skipAnalysisAlert,
    savePlaceSection,
    setAnalysisAlert,
  ]);

  const isGuideActive = useRecoilValue(activeGuideAtom);

  return (
    <>
      <div className="flex h-52 flex-col rounded-2xl border bg-brand-600 bg-[url('/images/location-bg.svg')] bg-cover bg-center text-center shadow-widget print:hidden">
        <button className="h-10.5 flex w-10.5 cursor-pointer items-center justify-center rounded-full"></button>
        <Dialog open={isOpen}>
          <DialogTrigger asChild>
            <button onClick={handleOnClickTitle} disabled={isGuideActive}>
              <div
                className={cn({
                  'inline-block pb-10 pt-8 text-6xl font-light text-black/85 first-letter:uppercase':
                    true,
                  'text-2.75xl': width >= 540,
                })}
              >
                <Helper
                  className={{
                    button: 'locations-title' ? '-bottom-2.5 right-10 z-[150]' : 'hidden',
                    tooltip: 'w-fit-content',
                    active: 'text-6xl',
                  }}
                  tooltipPosition={{ top: -70, left: -40 }}
                  message="This shows the name of the area selected. This can be a country, a protected area, the world or your own custom area. Use this button to search for a country or a protected area. Countries can also be selected by clicking on the map"
                >
                  <h1 className="text-white" ref={titleRef}>
                    {locationName}
                  </h1>
                </Helper>
              </div>
            </button>
          </DialogTrigger>
          <LocationDialogContent close={closeMenu} />
        </Dialog>
        <LocationTools />
      </div>
      <AnalysisAlert />
    </>
  );
};

export default LocationWidget;
