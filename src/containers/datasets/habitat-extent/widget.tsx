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

import HabitatExtentChart from './chart';
import { useMangroveHabitatExtent, widgetSlug } from './hooks';

const HabitatExtent = () => {
  const queryClient = useQueryClient();
  const [datasetsSettings, setDatasetsSettings] = useSyncDatasetsSettings();
  const [selectedUnitAreaExtent, setUnitAreaExtent] = useState('km²');
  const [isCanceled, setIsCanceled] = useState(false);

  const handleQueryCancellation = useCallback(() => {
    setIsCanceled(true);
  }, []);

  const year = datasetsSettings['mangrove_habitat_extent']?.year;
  const { data, isFetching, isError, refetch } = useMangroveHabitatExtent(
    { ...(year && { year: Number(year) }), unit: selectedUnitAreaExtent },
    { enabled: !isCanceled },
    handleQueryCancellation
  );

  const { enabled: isAnalysisRunning } = useRecoilValue(analysisAtom);

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

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // Convert the button's value to a number since it's stored as a string
      const year = Number(e.currentTarget.value);

      // Validate the conversion result to make sure it's a valid number
      if (isNaN(year)) {
        console.error('Invalid year.');
        return;
      }

      // Proceed with updating the settings
      void setDatasetsSettings((prevSettings) => {
        const updatedSettings = {
          ...prevSettings,
          mangrove_habitat_extent: {
            ...prevSettings['mangrove_habitat_extent'],
            year: year,
          },
        };

        return updatedSettings;
      });
    },
    [setDatasetsSettings]
  );

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
            aria-label="Retry analysis"
            type="button"
            onClick={handleTryAgain}
            className="rounded-2xl bg-brand-800 px-6 py-1 text-sm text-white active:ring-2 active:ring-inset active:ring-brand-600"
          >
            Try again
          </button>
        </div>
      )}
      {data && !isFetching && !isError && !isCanceled && (
        <div className="space-y-4">
          <p className={WIDGET_SENTENCE_STYLE}>
            The area of mangrove habitat in <span className="font-bold"> {location}</span> was{' '}
            <span className="notranslate font-bold">
              {area}{' '}
              <Popover>
                <PopoverTrigger asChild>
                  <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                    {selectedUnitAreaExtent}
                    <Icon
                      icon={ARROW_SVG}
                      className={`${WIDGET_SELECT_ARROW_STYLES} print:hidden`}
                      description="Arrow"
                    />
                  </span>
                </PopoverTrigger>
                <PopoverContent className="rounded-2xl px-2 shadow-border">
                  <ul className="z-20 max-h-32 space-y-0.5">
                    {unitOptions?.map((u) => (
                      <li key={u}>
                        <button
                          aria-label="select unit"
                          className={cn({
                            'w-full rounded-lg py-1 px-2 text-left hover:bg-brand-800/20': true,
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
            in{' '}
            <Popover>
              <PopoverTrigger asChild>
                <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                  {year || defaultYear}
                  <Icon
                    icon={ARROW_SVG}
                    className={`${WIDGET_SELECT_ARROW_STYLES} print:hidden`}
                    description="Arrow"
                  />
                </span>
              </PopoverTrigger>
              <PopoverContent className="rounded-2xl px-2 shadow-border">
                <ul className="z-20 max-h-56 space-y-0.5">
                  {years?.map((y) => (
                    <li key={y} className="last-of-type:pb-4">
                      <button
                        aria-label="select year"
                        className={cn({
                          'rounded-lg py-1 px-2 hover:bg-brand-800/20': true,
                          'font-semibold text-brand-800': y === year || y === defaultYear,
                        })}
                        type="button"
                        value={Number(y)}
                        onClick={handleClick}
                      >
                        {y || defaultYear}
                      </button>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
            , this represents a linear coverage of{' '}
            <span className="font-bold">{mangroveCoastCoveragePercentage}%</span> of the
            <span className="notranslate font-bold">
              {' '}
              {totalLength} {defaultUnitLinearCoverage}
            </span>{' '}
            of the coastline.
          </p>
          <HabitatExtentChart legend={legend} config={config} />
        </div>
      )}
    </div>
  );
};

export default HabitatExtent;
