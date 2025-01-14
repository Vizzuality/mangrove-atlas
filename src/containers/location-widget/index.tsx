import { useEffect, useState, useRef, useMemo, useCallback } from 'react';

import { useRouter } from 'next/router';

import { cn } from 'lib/classnames';

import { analysisAlertAtom, analysisAtom, skipAnalysisAlertAtom } from 'store/analysis';
import { activeGuideAtom } from 'store/guide';
import { locationsModalAtom } from 'store/locations';
import { locationToolAtom } from 'store/sidebar';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import AnalysisAlert from 'containers/alert';
import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';
import LocationDialogContent from 'containers/location-dialog-content';
import MenuTools from 'containers/navigation/menu-tools';

import { Dialog, DialogTrigger } from 'components/ui/dialog';

const LocationWidget = () => {
  const {
    query: { params },
  } = useRouter();
  const locationType = (params?.[0] || 'worldwide') as LocationTypes;
  const id = params?.[1];
  const {
    data: { name },
  } = useLocation(id, locationType, {
    enabled: (!!locationType && !!id) || locationType !== 'custom-area',
  });

  const [{ enabled: isAnalysisEnabled }] = useRecoilState(analysisAtom);

  const [isAnalysisAlertOpen, setAnalysisAlert] = useRecoilState(analysisAlertAtom);
  const [locationsModalIsOpen, setLocationsModalIsOpen] = useRecoilState(locationsModalAtom);
  const skipAnalysisAlert = useRecoilValue(skipAnalysisAlertAtom);
  const saveLocationTool = useSetRecoilState(locationToolAtom);

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
    const width = titleRef?.current?.getBoundingClientRect()?.width;
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
    saveLocationTool('search');
  }, [
    openLocationsModal,
    isAnalysisEnabled,
    skipAnalysisAlert,
    saveLocationTool,
    setAnalysisAlert,
  ]);

  const isGuideActive = useRecoilValue(activeGuideAtom);

  return (
    <>
      <div className="relative flex h-52 flex-col justify-between rounded-4xl bg-brand-600 bg-[url('/images/location-bg.svg')] bg-cover bg-center text-center shadow-control print:hidden">
        <Dialog open={isOpen}>
          <DialogTrigger asChild>
            <button onClick={handleOnClickTitle} disabled={isGuideActive || !locationName}>
              {!!locationName ? (
                <div
                  className={cn({
                    'inline-block h-[128px] flex-1 grow px-10 pt-8 text-6xl font-light text-black/85 first-letter:uppercase':
                      true,
                    'text-2.75xl': width >= 540,

                    'text-5xl': locationName.length > 10,
                    'text-4xl': locationName.length > 30 && locationName.length <= 55,
                    'text-2xl': locationName.length > 55 && locationName.length <= 120,
                    'break-all text-base': locationName.length > 120,
                  })}
                >
                  <h1 className="text-white" ref={titleRef}>
                    {locationName}
                  </h1>
                </div>
              ) : (
                !locationName && (
                  <div className="bg-secondary-900 h-[20px] w-[100px] animate-pulse rounded-md" />
                )
              )}
            </button>
          </DialogTrigger>
          <LocationDialogContent close={closeMenu} />
        </Dialog>
        <MenuTools />
      </div>
      <AnalysisAlert />
    </>
  );
};

export default LocationWidget;
