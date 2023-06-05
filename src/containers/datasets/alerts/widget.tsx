import { useMemo, useEffect } from 'react';

import cn from 'lib/classnames';

import { basemapContextualAtom, basemapContextualVisualMonthlyDateAtom } from 'store/map-settings';
import { alertsStartDate, alertsEndDate } from 'store/widgets/alerts';

import { useRecoilState } from 'recoil';

import { useMosaicsFromSeriesPlanetSatelliteBasemaps } from 'containers/datasets/contextual-layers/basemaps-planet/hooks';

import Chart from 'components/chart';
import Icon from 'components/icon';
import Loading from 'components/loading';
import SuggestedLayers from 'components/suggested-layers';
import {
  Tooltip,
  TooltipContent,
  TooltipArrow,
  TooltipTrigger,
  TooltipPortal,
} from 'components/tooltip';
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
  const [basemapContextualSelected, setBasemapContextual] = useRecoilState(basemapContextualAtom);
  const isActive = useMemo(
    () => basemapContextualSelected.includes('planet_medres_visual_monthly'),
    [basemapContextualSelected]
  );

  const { data: dates } = useMosaicsFromSeriesPlanetSatelliteBasemaps(
    '45d01564-c099-42d8-b8f2-a0851accf3e7'
  );
  const [date, setDate] = useRecoilState(basemapContextualVisualMonthlyDateAtom);
  const {
    isLoading,
    isFetched,
    isPlaceholderData,
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
  } = useAlerts(startDate, endDate);

  useEffect(() => {
    if (!date?.value) {
      setDate(dates?.[dates?.length - 1]);
    }
  }, [dates]);

  if (!fullData.length) return null;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <div>
          <p className={WIDGET_SENTENCE_STYLE}>
            There were <span className="font-bold"> {alertsTotal}</span> mangrove disturbance alerts
            between{' '}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                  {selectedStartDate?.label}
                  <Icon
                    icon={ARROW_SVG}
                    className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2 print:hidden"
                  />
                </span>
              </TooltipTrigger>

              <TooltipPortal>
                <TooltipContent
                  side="bottom"
                  align="center"
                  className="rounded-3xl bg-white  text-black/85 shadow-soft"
                >
                  <ul className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}>
                    {startDateOptions?.map((date) => (
                      <li key={date?.label}>
                        <button
                          className={cn({
                            'font-bold': true,
                            'hover:text-brand-800':
                              startDate?.value !== date?.value && date?.value < endDate?.value,
                            'opacity-50': date?.value > endDate?.value,
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

                  <TooltipArrow className=" fill-white" width={10} height={5} />
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>{' '}
            and{' '}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                  {selectedEndDate?.label}
                  <Icon
                    icon={ARROW_SVG}
                    className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2 print:hidden"
                  />
                </span>
              </TooltipTrigger>

              <TooltipPortal>
                <TooltipContent
                  side="bottom"
                  align="center"
                  className="rounded-3xl bg-white  text-black/85 shadow-soft"
                >
                  <ul className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}>
                    {endDateOptions?.map((date) => (
                      <li key={date?.label}>
                        <button
                          className={cn({
                            'font-bold': true,
                            'hover:text-brand-800':
                              endDate?.value !== date?.value && date?.value > startDate?.value,
                            'opacity-50': date?.value < startDate?.value,
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

                  <TooltipArrow className=" fill-white" width={10} height={5} />
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>
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
      <div className="space-y-2">
        <div className="absolute left-0 right-0 h-1 border-b border-dashed text-brand-800" />
        <p className="items-center pt-6 font-sans text-lg font-light leading-7">
          There are <span className="font-bold"> 535</span> areas monitored in the world.
        </p>
        <div className="flex space-x-2">
          <div className="text-brand-900 h-4 w-4 border-2 border-brand-800" />
          <p className="text-sm font-normal">Monitored area</p>
        </div>
      </div>
      <div>
        <SuggestedLayers
          name="Planet Satellite Imagery"
          id="planet_medres_visual_monthly"
          description="We recommend you to use Planet Satellite Imagery to validate the alerts."
        >
          {isActive && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex w-full cursor-pointer items-center justify-between rounded-3xl border-2 border-brand-800 border-opacity-50 py-1 px-4">
                  <p className="first-line:after">
                    Period: <span className="text-sm font-bold">{date.label}</span>
                  </p>
                  <Icon
                    icon={ARROW_SVG}
                    className={cn({
                      '[data-state=closed]:rotate-180 relative inline-block h-1.5 w-2.5 font-bold':
                        true,
                    })}
                  />
                </div>
              </TooltipTrigger>

              <TooltipPortal>
                <TooltipContent
                  side="top"
                  align="center"
                  className="rounded-3xl bg-white  text-black/85 shadow-soft"
                >
                  <ul className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}>
                    {dates?.map((d) => (
                      <li key={d.value}>
                        <button
                          className={cn({
                            'font-bold': true,
                            'hover:text-brand-800': true,
                          })}
                          type="button"
                          onClick={() => setDate(d)}
                          // disabled={date?.value < value}
                        >
                          {d.label}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <TooltipArrow className=" fill-white" width={10} height={5} />
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>
          )}
        </SuggestedLayers>
      </div>
    </div>
  );
};

export default AlertsWidget;
