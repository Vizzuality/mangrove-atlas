import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { trackEvent } from '@/lib/analytics/ga';
import cn from '@/lib/classnames';

import { analysisAtom } from '@/store/analysis';
import { habitatExtentIsPlaying, habitatExtentSettings } from '@/store/widgets/habitat-extent';

import { useQueryClient } from '@tanstack/react-query';
import type { PrimitiveAtom } from 'jotai';
import { useAtom, useAtomValue } from 'jotai';

import ContextualLayersWrapper from '@/containers/widget/contextual-layers';
import { widgets } from '@/containers/widgets/constants';
import NoData from '@/containers/widgets/no-data';

import Loading from '@/components/ui/loading';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import TimelineSlider from '@/components/ui/timeline-slider';
import {
  WIDGET_CARD_WRAPPER_STYLE,
  WIDGET_SELECT_ARROW_STYLES,
  WIDGET_SELECT_STYLES,
  WIDGET_SENTENCE_STYLE,
} from 'styles/widgets';

import ARROW_SVG from '@/svgs/ui/arrow-filled';

import HabitatExtentChart from './chart';
import { useMangroveHabitatExtent, widgetSlug } from './hooks';

const HabitatExtent = () => {
  const queryClient = useQueryClient();
  const [year, setYear] = useAtom(habitatExtentSettings as unknown as PrimitiveAtom<number | null>);
  const [isPlaying, setIsPlaying] = useAtom(habitatExtentIsPlaying);
  const [selectedUnitAreaExtent, setUnitAreaExtent] = useState('km²');
  const [isCanceled, setIsCanceled] = useState(false);

  const handleQueryCancellation = useCallback(() => {
    setIsCanceled(true);
  }, []);

  const { data, isFetching, isError, refetch } = useMangroveHabitatExtent(
    { year, unit: selectedUnitAreaExtent },
    { enabled: !isCanceled },
    handleQueryCancellation
  );

  const { enabled: isAnalysisRunning } = useAtomValue(analysisAtom);

  const handleCancelAnalysis = useCallback(async () => {
    await queryClient.cancelQueries({
      predicate: ({ queryKey }) => queryKey.includes(widgetSlug),
      fetchStatus: 'fetching',
    });
  }, [queryClient]);

  const handleTryAgain = useCallback(async () => {
    await refetch();
    setIsCanceled(false);
  }, [refetch]);

  const {
    area,
    location,
    mangroveCoastCoveragePercentage,
    totalLength,
    years,
    defaultYear,
    legend,
    unitOptions,
    config,
    defaultUnitLinearCoverage,
    noData,
  } = data;

  const sortedYears = useMemo(() => [...(years || [])].sort((a, b) => a - b), [years]);
  const currentYear = year || defaultYear;

  const yearRef = useRef(currentYear);
  useEffect(() => {
    yearRef.current = currentYear;
  }, [currentYear]);

  useEffect(() => {
    if (!isPlaying || !sortedYears.length) return;
    const intervalId = setInterval(() => {
      const idx = sortedYears.indexOf(yearRef.current ?? sortedYears[sortedYears.length - 1]);
      const next = (idx + 1) % sortedYears.length;
      setYear(sortedYears[next]);
    }, 1200);
    return () => clearInterval(intervalId);
  }, [isPlaying, sortedYears, setYear]);

  const handleTogglePlay = useCallback(() => {
    trackEvent('Widget iteration - timeline playback in habitat extent', {
      category: 'Widget iteration',
      action: isPlaying ? 'Pause' : 'Play',
      label: 'Widget iteration - timeline playback in habitat extent',
    });
    setIsPlaying(!isPlaying);
  }, [isPlaying, setIsPlaying]);

  const handleYearChange = useCallback(
    (y: number) => {
      trackEvent('Widget iteration - date change in habitat extent', {
        category: 'Widget iteration',
        action: 'Select',
        label: `Widget iteration - change date in habitat extent to ${y}`,
        value: y,
      });
      setYear(y);
    },
    [setYear]
  );

  const widgetInfo = useMemo(() => {
    return widgets.find((widget) => widget.slug === 'mangrove_habitat_extent');
  }, [widgets]);

  const contextualLayers = useMemo(() => {
    return widgetInfo?.contextualLayers || [];
  }, [widgetInfo]);

  if (noData) return <NoData />;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <div className="flex flex-col items-center space-y-4">
        <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
        {isAnalysisRunning && isFetching && !isCanceled && (
          <button
            aria-label="cancel analysis"
            type="button"
            onClick={() => void handleCancelAnalysis()}
            className="bg-brand-800 active:ring-brand-600 rounded-2xl px-6 py-1 text-sm text-white active:ring-2 active:ring-inset"
          >
            Cancel analysis
          </button>
        )}
      </div>
      {(isCanceled || isError) && !isFetching && !data && (
        <div className="flex flex-col items-center space-y-4">
          <p className={`${WIDGET_SENTENCE_STYLE} italic`}>
            An error occurred while fetching the data. You can try again.
          </p>
          <button
            aria-label="Retry analysis"
            type="button"
            onClick={handleTryAgain}
            className="bg-brand-800 active:ring-brand-600 rounded-2xl px-6 py-1 text-sm text-white active:ring-2 active:ring-inset"
          >
            Try again
          </button>
        </div>
      )}
      {!!data && !isFetching && !isError && (
        <div className="space-y-4">
          <p className={WIDGET_SENTENCE_STYLE}>
            The area of mangrove habitat in <span className="font-bold"> {location}</span> was{' '}
            <span className="notranslate font-bold">
              {area}{' '}
              <Popover>
                <PopoverTrigger asChild>
                  <span className={`${WIDGET_SELECT_STYLES}`}>
                    {selectedUnitAreaExtent}
                    <ARROW_SVG
                      className={`fill-current ${WIDGET_SELECT_ARROW_STYLES}`}
                      role="img"
                      title="Arrow"
                    />
                  </span>
                </PopoverTrigger>
                <PopoverContent className="shadow-border rounded-2xl px-2">
                  <ul className="z-20 max-h-32 space-y-0.5">
                    {unitOptions?.map((u) => (
                      <li key={u}>
                        <button
                          aria-label="select unit"
                          className={cn({
                            'hover:bg-brand-800/20 w-full rounded-lg px-2 py-1 text-left': true,
                            'hover:text-brand-800': selectedUnitAreaExtent !== u,
                            'pointer-events-none opacity-50': selectedUnitAreaExtent === u,
                          })}
                          type="button"
                          onClick={() => setUnitAreaExtent(u)}
                          disabled={selectedUnitAreaExtent === u}
                        >
                          {u}
                        </button>
                      </li>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>
            </span>{' '}
            in <span className="font-bold">{currentYear}</span>, this represents a linear coverage
            of <span className="font-bold">{mangroveCoastCoveragePercentage}%</span> of the
            <span className="notranslate font-bold">
              {' '}
              {totalLength} {defaultUnitLinearCoverage}
            </span>{' '}
            of the coastline.
          </p>
          {sortedYears.length > 1 && (
            <TimelineSlider
              years={sortedYears}
              currentYear={currentYear}
              isPlaying={isPlaying}
              onYearChange={handleYearChange}
              onTogglePlay={handleTogglePlay}
            />
          )}
          <div className="-mx-2">
            <ContextualLayersWrapper
              origin="mangrove_alerts"
              id={contextualLayers[0].id}
              description={contextualLayers[0].description}
            />
            <HabitatExtentChart legend={legend} config={config} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitatExtent;
