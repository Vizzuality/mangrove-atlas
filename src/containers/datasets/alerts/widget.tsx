import { useCallback, useMemo, useState } from 'react';

import { trackEvent } from '@/lib/analytics/ga';
import cn from '@/lib/classnames';

import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { activeLayersAtom } from '@/store/layers';
import { alertsEndDate, alertsStartDate } from '@/store/widgets/alerts';

import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { useRecoilState, useRecoilValue } from 'recoil';

import ContextualLayersWrapper from '@/containers/widget/contextual-layers';
import { widgets } from '@/containers/widgets/constants';
import NoData from '@/containers/widgets/no-data';

import Chart from 'components/chart';
import Icon from 'components/ui/icon';
import Loading from 'components/ui/loading';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import {
  WIDGET_CARD_WRAPPER_STYLE,
  WIDGET_SELECT_STYLES,
  WIDGET_SENTENCE_STYLE,
} from 'styles/widgets';

import ARROW_SVG from '@/svgs/ui/arrow.svg?sprite';

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
    () => activeLayers?.find(({ id }) => id === 'planet_medres_visual_monthly'),
    [activeLayers]
  );

  const widgetInfo = useMemo(
    () => widgets.find((widget) => widget.slug === 'mangrove_alerts'),
    [widgets]
  );
  const contextualLayers = useMemo(() => widgetInfo?.contextualLayers || [], [widgetInfo]);
  type FC = FeatureCollection<Geometry, GeoJsonProperties>;

  const geometry = useMemo<FC | undefined>(() => {
    // pick ONE geometry source (custom wins over uploaded, tweak if you want)
    if (customGeojson) return customGeojson as FC;
    if (uploadedGeojson) return uploadedGeojson as FC;
    return undefined;
  }, [customGeojson, uploadedGeojson]);

  const dataParams = useMemo(() => {
    return geometry ? { geometry } : undefined;
  }, [geometry]);

  const queryOptions = useMemo(() => ({ enabled: !isCanceled }), [isCanceled]);

  const { data, isLoading, isFetched, isError, isPlaceholderData, refetch } = useAlerts(
    startDate ?? undefined,
    endDate ?? undefined,
    undefined,
    dataParams,
    queryOptions,
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
            className="bg-brand-800 active:ring-brand-600 rounded-2xl px-6 py-1 text-sm text-white active:ring-2 active:ring-inset"
          >
            Try again
          </button>
        </div>
      )}
      {isFetched && !isLoading && !isError && (
        <div className="space-y-8">
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

              <PopoverContent className="shadow-border rounded-2xl px-2">
                <ul className="z-20 max-h-56 space-y-0.5">
                  {startDateOptions?.map((date) => (
                    <li key={date?.label} className="last-of-type:pb-4">
                      <button
                        aria-label="Select start date"
                        className={cn({
                          'hover:bg-brand-800/20 w-full rounded-lg px-2 py-1 text-left': true,
                          'text-brand-800 font-semibold': startDate?.value === date?.value,
                          'pointer-events-none opacity-50': date?.value > (endDate?.value ?? 0),
                        })}
                        type="button"
                        onClick={() => {
                          // Google Analytics tracking
                          trackEvent('Widget iteration - start date change in alerts', {
                            category: 'Widget iteration',
                            action: 'Select',
                            label: `Widget iteration - alerts start date ${date.value}`,
                            date: date.value,
                          });
                          setStartDate(date);
                        }}
                        disabled={date?.value > (endDate?.value ?? 0)}
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

              <PopoverContent className="shadow-border rounded-2xl px-2">
                <ul className="z-20 max-h-56 space-y-0.5">
                  {endDateOptions?.map((date) => (
                    <li key={date?.label} className="last-of-type:pb-4">
                      <button
                        aria-label="Select end date"
                        className={cn({
                          'hover:bg-brand-800/20 w-full rounded-lg px-2 py-1 text-left': true,
                          'text-brand-800 font-semibold': endDate?.value === date?.value,
                          'pointer-events-none opacity-50': date?.value < (startDate?.value ?? 0),
                        })}
                        type="button"
                        onClick={() => {
                          // Google Analytics tracking
                          trackEvent('Widget iteration - end date change in alerts', {
                            category: 'Widget iteration',
                            action: 'Select',
                            label: `Widget iteration - alerts end date ${date.value}`,
                            value: date.value,
                          });
                          return setEndDate(date);
                        }}
                        disabled={date?.value < (startDate?.value ?? 0)}
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
          <div className="-mx-2">
            <ContextualLayersWrapper
              origin="mangrove_alerts"
              id={contextualLayers[0].id}
              description={contextualLayers[0].description}
            />
          </div>

          <Legend />
          <Chart config={config} />
          <Chart
            config={{
              ...configBrush,
              onBrushEnd: ({ startIndex, endIndex }) => {
                if (startIndex) {
                  // Google Analytics tracking
                  trackEvent('Widget iteration - start date change in alerts', {
                    category: 'Widget iteration',
                    action: 'Brush - drag',
                    label: `Widget iteration - alerts start date ${fullData[startIndex]?.startDate}`,
                    value: fullData[startIndex]?.startDate,
                  });
                  setStartDate(fullData[startIndex]?.startDate);
                }
                if (endIndex) {
                  // Google Analytics tracking
                  trackEvent('Widget iteration - end date change in alerts', {
                    category: 'Widget iteration',
                    action: 'Brush - drag',
                    label: `Widget iteration - alerts end date ${fullData[endIndex]?.endDate}`,
                    value: fullData[endIndex]?.endDate,
                  });
                  setEndDate(fullData[endIndex]?.endDate);
                }
              },
              startIndex: configBrush?.customBrush?.startIndex,
              endIndex: configBrush?.customBrush?.endIndex,
            }}
          />
        </div>
      )}
      {!isError && !isLoading && (
        <div className="space-y-2">
          <p className="items-center pt-6 font-sans text-lg leading-7 font-light">
            There are <span className="font-bold"> 535</span> areas monitored in the world.
          </p>
        </div>
      )}
    </div>
  );
};

export default AlertsWidget;
