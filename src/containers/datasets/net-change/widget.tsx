import { useCallback, useState } from 'react';

import cn from 'lib/classnames';
import { useSyncDatasetsSettings } from 'lib/utils/sync-query';

import { analysisAtom } from 'store/analysis';

import { useQueryClient } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';

import NoData from 'containers/widgets/no-data';

import Icon from 'components/icon';
import Loading from 'components/loading';
import { Popover, PopoverContent, PopoverTrigger } from 'components/popover';
import {
  WIDGET_CARD_WRAPPER_STYLE,
  WIDGET_SENTENCE_STYLE,
  WIDGET_SELECT_STYLES,
  WIDGET_SELECT_ARROW_STYLES,
} from 'styles/widgets';

import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

import NetChangeChart from './chart';
import { useMangroveNetChange, widgetSlug } from './hooks';

const NetChangeWidget = () => {
  const queryClient = useQueryClient();
  const [selectedUnit, setUnit] = useState('km²');
  const [datasetsSettings, setDatasetsSettings] = useSyncDatasetsSettings();
  const { startYear, endYear } = datasetsSettings['mangrove_net_change'] || {};
  const { enabled: isAnalysisRunning } = useRecoilValue(analysisAtom);

  const [isCanceled, setIsCanceled] = useState(false);

  const handleQueryCancellation = useCallback(() => {
    setIsCanceled(true);
  }, []);

  const handleCancelAnalysis = useCallback(async () => {
    await queryClient.cancelQueries({
      predicate: ({ queryKey }) => queryKey.includes(widgetSlug),
      fetchStatus: 'fetching',
    });
  }, [queryClient]);

  const handleYearChange = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const yearType = e.currentTarget.getAttribute('data-year-type');
      const yearValue = parseInt(e.currentTarget.value, 10);

      if (!yearType || isNaN(yearValue)) return;
      console.log(yearType, yearValue, 'despues');
      void setDatasetsSettings((currentSettings) => ({
        ...currentSettings,
        mangrove_net_change: {
          ...currentSettings['mangrove_net_change'],
          [yearType]: yearValue,
        },
      }));
    },
    [setDatasetsSettings]
  );

  const {
    netChange,
    direction,
    config,
    location,
    unitOptions,
    years,
    data,
    isFetching,
    currentEndYear,
    currentStartYear,
    refetch,
    isError,
    noData,
  } = useMangroveNetChange(
    {
      selectedUnit,
      startYear,
      endYear,
    },
    { enabled: !isCanceled },
    handleQueryCancellation
  );

  const handleTryAgain = useCallback(async () => {
    setIsCanceled(false);
    await refetch();
  }, [refetch]);

  if (noData) return <NoData />;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <div className="flex flex-col items-center space-y-4">
        <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
        {isAnalysisRunning && isFetching && !isCanceled && (
          <button
            type="button"
            onClick={handleCancelAnalysis}
            className="rounded-2xl bg-brand-800 px-6 py-1 text-sm text-white active:ring-2 active:ring-inset active:ring-brand-600"
          >
            Cancel analysis
          </button>
        )}
      </div>
      {(isCanceled || isError) && !isFetching && (
        <div className="flex flex-col items-center space-y-4">
          <p className={`${WIDGET_SENTENCE_STYLE} italic`}>
            An error occurred while fetching the data. You can try again.
          </p>
          <button
            type="button"
            onClick={handleTryAgain}
            className="rounded-2xl bg-brand-800 px-6 py-1 text-sm text-white active:ring-2 active:ring-inset active:ring-brand-600"
          >
            Try again
          </button>
        </div>
      )}
      {data && !isFetching && !isError && !isCanceled && (
        <div>
          <p className={WIDGET_SENTENCE_STYLE}>
            The extent of mangroves in <span className="font-bold"> {location}</span> has{' '}
            <span className="font-bold"> {direction}</span> by{' '}
            <span className="font-bold"> {netChange}</span>{' '}
            <Popover>
              <PopoverTrigger asChild>
                <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                  {selectedUnit}
                  <Icon icon={ARROW_SVG} className={`${WIDGET_SELECT_ARROW_STYLES} print:hidden`} />
                </span>
              </PopoverTrigger>

              <PopoverContent className="rounded-2xl px-2 shadow-border">
                <ul className="z-20 max-h-32 space-y-0.5">
                  {unitOptions?.map((u) => (
                    <li key={u}>
                      <button
                        className={cn({
                          'w-full rounded-lg py-1 px-2 text-left hover:bg-brand-800/20': true,
                          'hover:text-brand-800': selectedUnit !== u,
                          'pointer-events-none opacity-50': selectedUnit === u,
                        })}
                        type="button"
                        onClick={() => setUnit(u)}
                        disabled={selectedUnit === u}
                      >
                        {u}
                      </button>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>{' '}
            between{' '}
            <Popover>
              <PopoverTrigger asChild>
                <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                  {currentStartYear}
                  <Icon icon={ARROW_SVG} className={`${WIDGET_SELECT_ARROW_STYLES} print:hidden`} />
                </span>
              </PopoverTrigger>

              <PopoverContent className="rounded-2xl px-2 shadow-border">
                <ul className="z-20 max-h-56 space-y-0.5">
                  {years?.map((y) => (
                    <li key={y} className="last-of-type:pb-4">
                      <button
                        className={cn({
                          'rounded-lg py-1 px-2 hover:bg-brand-800/20': true,
                          'font-semibold text-brand-800': currentStartYear === y,
                          'pointer-events-none opacity-50':
                            y > currentEndYear || currentEndYear === y,
                        })}
                        type="button"
                        data-year-type="startYear"
                        value={Number(y)}
                        onClick={handleYearChange}
                        disabled={
                          currentStartYear === y || y > currentEndYear || currentEndYear === y
                        }
                      >
                        {y}
                      </button>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>{' '}
            and{' '}
            <Popover>
              <PopoverTrigger asChild>
                <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                  {currentEndYear}
                  <Icon icon={ARROW_SVG} className={`${WIDGET_SELECT_ARROW_STYLES} print:hidden`} />
                </span>
              </PopoverTrigger>

              <PopoverContent className="rounded-2xl px-2 shadow-border">
                <ul className="z-20 max-h-56 space-y-0.5">
                  {years?.map((y) => (
                    <li key={y} className="last-of-type:pb-4">
                      <button
                        className={cn({
                          'rounded-lg py-1 px-2 hover:bg-brand-800/20': true,
                          'font-semibold text-brand-800': currentEndYear === y,
                          'pointer-events-none opacity-50':
                            y < currentStartYear || currentStartYear === y,
                        })}
                        type="button"
                        data-year-type="endYear"
                        value={Number(y)}
                        onClick={handleYearChange}
                        disabled={
                          currentEndYear === y || y < currentStartYear || currentStartYear === y
                        }
                      >
                        {y}
                      </button>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
            .
          </p>

          <NetChangeChart config={config} />
        </div>
      )}
    </div>
  );
};

export default NetChangeWidget;
