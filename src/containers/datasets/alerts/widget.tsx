import { useCallback, useMemo, useState } from 'react';

import cn from 'lib/classnames';

import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';
import { activeLayersAtom } from 'store/layers';
import { alertsStartDate, alertsEndDate } from 'store/widgets/alerts';

import { useRecoilState, useRecoilValue } from 'recoil';

import NoData from 'containers/widgets/no-data';

import Chart from 'components/chart';
import DateSelect from 'components/planet-date-select';
import SuggestedLayers from 'components/suggested-layers';
import Icon from 'components/ui/icon';
import Loading from 'components/ui/loading';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import {
  WIDGET_CARD_WRAPPER_STYLE,
  WIDGET_SENTENCE_STYLE,
  WIDGET_SELECT_STYLES,
} from 'styles/widgets';

import ARROW_SVG from 'svgs/ui/arrow.svg?sprite';

import { useAlerts } from './hooks';
import Legend from './legend';

const AlertsWidget = () => {
  const [startDate, setStartDate] = useRecoilState(alertsStartDate);
  const [endDate, setEndDate] = useRecoilState(alertsEndDate);
  const { customGeojson } = useRecoilValue(drawingToolAtom);
  const { uploadedGeojson } = useRecoilValue(drawingUploadToolAtom);
  const activeLayers = useRecoilValue(activeLayersAtom);
  const [isCanceled, setIsCanceled] = useState(false);

  const handleQueryCancellation = useCallback(() => {
    setIsCanceled(true);
  }, []);

  const isActive = useMemo(
    () => activeLayers.find(({ id }) => id === 'planet_medres_visual_monthly'),
    [activeLayers]
  );

  const { data, isLoading, isFetched, isError, isPlaceholderData, refetch } = useAlerts(
    startDate,
    endDate,
    null,
    {
      ...(customGeojson && { geometry: customGeojson }),
      ...(uploadedGeojson && { geometry: uploadedGeojson }),
    },
    { enabled: !isCanceled },
    handleQueryCancellation
  );

  const handleTryAgain = useCallback(async () => {
    setIsCanceled(false);
    await refetch();
  }, [refetch]);

  if (!data) return <NoData />;

  const {
    alertsTotal,
    startDateOptions,
    selectedStartDate,
    endDateOptions,
    selectedEndDate,
    config,
    configBrush,
    fullData,
    defaultStartDate,
    defaultEndDate,
  } = data;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isError && !isLoading && (
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
      {isFetched && !isLoading && !isError && (
        <div>
          <p className={WIDGET_SENTENCE_STYLE}>
            There were <span className="font-bold"> {alertsTotal}</span> mangrove disturbance alerts
            between{' '}
            <Popover>
              <PopoverTrigger>
                <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                  {selectedStartDate?.label}
                  <Icon
                    icon={ARROW_SVG}
                    className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2 print:hidden"
                    description="Arrow"
                  />
                </span>
              </PopoverTrigger>

              <PopoverContent className="rounded-2xl px-2 shadow-border">
                <ul className="z-20 max-h-56 space-y-0.5">
                  {startDateOptions?.map((date) => (
                    <li key={date?.label} className="last-of-type:pb-4">
                      <button
                        aria-label="Select start date"
                        className={cn({
                          'w-full rounded-lg py-1 px-2 text-left hover:bg-brand-800/20': true,
                          'font-semibold text-brand-800': startDate?.value === date?.value,
                          'pointer-events-none opacity-50': date?.value > endDate?.value,
                        })}
                        type="button"
                        onClick={() => setStartDate(date)}
                        disabled={date?.value > endDate?.value}
                      >
                        {date?.label || defaultStartDate?.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>{' '}
            and{' '}
            <Popover>
              <PopoverTrigger>
                <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                  {selectedEndDate?.label}
                  <Icon
                    icon={ARROW_SVG}
                    className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2 print:hidden"
                    description="Arrow"
                  />
                </span>
              </PopoverTrigger>

              <PopoverContent className="rounded-2xl px-2 shadow-border">
                <ul className="z-20 max-h-56 space-y-0.5">
                  {endDateOptions?.map((date) => (
                    <li key={date?.label} className="last-of-type:pb-4">
                      <button
                        aria-label="Select end date"
                        className={cn({
                          'w-full rounded-lg py-1 px-2 text-left hover:bg-brand-800/20': true,
                          'font-semibold text-brand-800': endDate?.value === date?.value,
                          'pointer-events-none opacity-50': date?.value < startDate?.value,
                        })}
                        type="button"
                        onClick={() => {
                          return setEndDate(date);
                        }}
                        disabled={date?.value < startDate?.value}
                      >
                        {date?.label || defaultEndDate?.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
            .
          </p>
          <Legend />
          <Chart config={config} />
          <Chart
            config={{
              ...configBrush,
              onBrushEnd: ({ startIndex, endIndex }) => {
                if (startIndex) setStartDate(fullData[startIndex]?.startDate);
                if (endIndex) setEndDate(fullData[endIndex]?.endDate);
              },
              startIndex: configBrush?.customBrush?.startIndex,
              endIndex: configBrush?.customBrush?.endIndex,
            }}
          />
        </div>
      )}
      {!isError && !isLoading && (
        <>
          <div className="space-y-2">
            <div className="absolute left-0 right-0 h-1 border-b border-dashed text-brand-800" />
            <p className="items-center pt-6 font-sans text-lg font-light leading-7">
              There are <span className="font-bold"> 535</span> areas monitored in the world.
            </p>
            <div className="flex space-x-2">
              <div className="flex">
                <div className="flex flex-col">
                  <div className="text-brand-900 h-2 w-2 border-2 border-brand-800" />
                  <div className="text-brand-900 h-2 w-2 border-2 border-brand-800" />
                </div>
                <div className="text-brand-900 h-2 w-2 border-2 border-brand-800" />
              </div>
              <p className="text-sm font-normal">Monitored area</p>
            </div>
          </div>
          <div>
            <SuggestedLayers
              name="Planet-NICFI Satellite Imagery"
              thumbSource="/images/thumbs/basemaps/basemap-satellite.jpg"
              id="planet_medres_visual_monthly"
              description="We recommend you to use ## Planet-NICFI Satellite Imagery to validate the alerts."
            >
              {isActive && (
                <DateSelect
                  mosaic_id="45d01564-c099-42d8-b8f2-a0851accf3e7"
                  id="planet_medres_visual_monthly"
                  className={{ content: 'w-[420px]' }}
                />
              )}
            </SuggestedLayers>
          </div>
        </>
      )}
    </div>
  );
};

export default AlertsWidget;
