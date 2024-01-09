import { useMemo } from 'react';

import cn from 'lib/classnames';

import { activeLayersAtom } from 'store/layers';
import { alertsStartDate, alertsEndDate } from 'store/widgets/alerts';

import { useRecoilState, useRecoilValue } from 'recoil';

import Chart from 'components/chart';
import Icon from 'components/icon';
import Loading from 'components/loading';
import DateSelect from 'components/planet-date-select';
import { Popover, PopoverContent, PopoverTrigger } from 'components/popover';
import SuggestedLayers from 'components/suggested-layers';
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
  const activeLayers = useRecoilValue(activeLayersAtom);
  const isActive = useMemo(
    () => activeLayers.find(({ id }) => id === 'planet_medres_visual_monthly'),
    [activeLayers]
  );

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

              <PopoverContent>
                <ul className="max-h-56 space-y-2">
                  {startDateOptions?.map((date) => (
                    <li key={date?.label} className="last-of-type:pb-4">
                      <button
                        aria-label="Select start date"
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

              <PopoverContent>
                <ul className="max-h-56 space-y-2">
                  {endDateOptions?.map((date) => (
                    <li key={date?.label} className="last-of-type:pb-4">
                      <button
                        aria-label="Select end date"
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
          name="Planet-NICFI Satellite Imagery"
          thumbSource="/images/thumbs/basemaps/planet.svg"
          id="planet_medres_visual_monthly"
          description="We recommend you to use Planet-NICFI Satellite Imagery to validate the alerts."
        >
          {isActive && (
            <div className="pb-4">
              <DateSelect
                mosaic_id="45d01564-c099-42d8-b8f2-a0851accf3e7"
                id="planet_medres_visual_monthly"
              />
            </div>
          )}
        </SuggestedLayers>
      </div>
    </div>
  );
};

export default AlertsWidget;
