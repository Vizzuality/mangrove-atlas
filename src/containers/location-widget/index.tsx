import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import cn from '@/lib/classnames';

import { analysisAlertAtom, analysisAtom, skipAnalysisAlertAtom } from '@/store/analysis';
import { activeGuideAtom } from '@/store/guide';
import { locationsModalAtom } from '@/store/locations';
import { locationToolAtom } from '@/store/sidebar';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { useSyncLocation } from 'hooks/use-sync-location';

import AnalysisAlert from '@/containers/alert';
import { useLocation } from '@/containers/datasets/locations/hooks';
import type { LocationTypes } from '@/containers/datasets/locations/types';
import LocationDialogContent from '@/containers/location-dialog-content';
import MenuTools from '@/containers/navigation/menu-tools';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';

const LocationWidget = () => {
  const { type, id } = useSyncLocation();
  const locationType = (type ?? 'worldwide') as LocationTypes;
  const {
    data: { name },
  } = useLocation(id, locationType, {
    enabled: (!!locationType && !!id) || locationType !== 'custom-area',
  });

  const [{ enabled: isAnalysisEnabled }] = useAtom(analysisAtom);

  const [isAnalysisAlertOpen, setAnalysisAlert] = useAtom(analysisAlertAtom);
  const [locationsModalIsOpen, setLocationsModalIsOpen] = useAtom(locationsModalAtom);
  const skipAnalysisAlert = useAtomValue(skipAnalysisAlertAtom);
  const saveLocationTool = useSetAtom(locationToolAtom);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  const isGuideActive = useAtomValue(activeGuideAtom);

  return (
    <>
      <div className="bg-brand-600 shadow-control relative flex h-52 flex-col justify-between rounded-3xl bg-[url(/images/location-bg.svg)] bg-cover bg-center text-center">
        <Dialog open={isOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              onClick={handleOnClickTitle}
              disabled={isGuideActive || !locationName}
            >
              {!!locationName ? (
                <div
                  className={cn({
                    'inline-block flex-1 grow cursor-pointer px-10 pt-8 text-6xl font-light text-black/85 first-letter:uppercase':
                      true,
                    'text-2.75xl': width >= 540,

                    'text-5xl': locationName.length > 10,
                    'text-3xl': locationName.length > 30 && locationName.length <= 55,
                    'text-2xl': locationName.length > 55 && locationName.length <= 120,
                    'text-base break-all': locationName.length > 120,
                  })}
                >
                  <h1 className="cursor-pointer text-white" ref={titleRef}>
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
