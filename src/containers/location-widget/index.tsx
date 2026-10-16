import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import cn from '@/lib/classnames';

import { analysisAlertAtom, analysisAtom, skipAnalysisAlertAtom } from '@/store/analysis';
import { customAreaLabelAtom } from '@/store/drawing-tool';
import { activeGuideAtom } from '@/store/guide';
import { locationsModalAtom } from '@/store/locations';
import { locationToolAtom } from '@/store/sidebar';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { useSyncLocation } from 'hooks/use-sync-location';

import AnalysisAlert from '@/containers/alert';
import { useLocation } from '@/containers/datasets/locations/hooks';
import type { LocationTypes } from '@/containers/datasets/locations/types';
import MenuTools from '@/containers/navigation/menu-tools';

const MAX_FONT_SIZE = 60; // text-6xl
const MIN_FONT_SIZE = 14;

/**
 * Largest font size (px) at which `text` fits inside `boxRef` without overflowing, so long
 * location names shrink instead of spilling over the header tools. Falls back to breaking
 * words when even the minimum size is too wide.
 */
const useFitFontSize = (text: string) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(MAX_FONT_SIZE);
  const [breakWords, setBreakWords] = useState(false);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const el = textRef.current;
    if (!box || !el) return;

    const fits = (size: number) => {
      el.style.fontSize = `${size}px`;
      return el.scrollHeight <= box.clientHeight && el.scrollWidth <= box.clientWidth;
    };

    const fit = () => {
      el.classList.remove('break-all');
      let lo = MIN_FONT_SIZE;
      let hi = MAX_FONT_SIZE;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        if (fits(mid)) lo = mid;
        else hi = mid - 1;
      }
      const tooWide = !fits(lo);
      el.style.fontSize = `${lo}px`;
      setFontSize(lo);
      setBreakWords(tooWide);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    // Metrics change once the web font loads.
    void document.fonts?.ready.then(fit);
    return () => observer.disconnect();
  }, [text]);

  return { boxRef, textRef, fontSize, breakWords };
};

const LocationWidget = () => {
  const { type, id } = useSyncLocation();
  const locationType = (type ?? 'worldwide') as LocationTypes;
  const {
    data: { name },
  } = useLocation(id, locationType, {
    enabled: (!!locationType && !!id) || locationType !== 'custom-area',
  });

  const [{ enabled: isAnalysisEnabled }] = useAtom(analysisAtom);
  const customAreaLabel = useAtomValue(customAreaLabelAtom);

  const setAnalysisAlert = useSetAtom(analysisAlertAtom);
  const [locationsModalIsOpen, setLocationsModalIsOpen] = useAtom(locationsModalAtom);
  const skipAnalysisAlert = useAtomValue(skipAnalysisAlertAtom);
  const saveLocationTool = useSetAtom(locationToolAtom);

  const locationName = useMemo(() => {
    if (locationType === 'custom-area') {
      return customAreaLabel ?? 'Custom Area';
    }
    if (locationType) {
      return name;
    }

    return 'Worldwide';
  }, [locationType, name, customAreaLabel]);

  const { boxRef, textRef, fontSize, breakWords } = useFitFontSize(locationName);

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
        <h1 className="contents">
          <button
            type="button"
            onClick={handleOnClickTitle}
            disabled={isGuideActive || !locationName}
            className="flex min-h-0 flex-1 flex-col px-10 pt-8 pb-2"
          >
            {!!locationName ? (
              <div
                ref={boxRef}
                className="flex min-h-0 w-full flex-1 justify-center overflow-hidden"
              >
                <span
                  ref={textRef}
                  style={{ fontSize }}
                  className={cn(
                    'block max-w-full cursor-pointer leading-[1.1] font-light text-white first-letter:uppercase',
                    breakWords && 'break-all'
                  )}
                >
                  {locationName}
                </span>
              </div>
            ) : (
              <>
                <span className="sr-only">Loading location</span>
                <div
                  aria-hidden="true"
                  className="bg-secondary-900 h-[20px] w-[100px] animate-pulse rounded-md"
                />
              </>
            )}
          </button>
        </h1>
        <MenuTools />
      </div>
      <AnalysisAlert />
    </>
  );
};

export default LocationWidget;
