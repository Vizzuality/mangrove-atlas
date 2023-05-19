import { useCallback, useState } from 'react';

import cn from 'lib/classnames';

import { habitatExtentSettings } from 'store/widgets/habitat-extent';

import { useRecoilState } from 'recoil';

import Icon from 'components/icon';
// import {
//   PopoverRoot,
//   PopoverContent,
//   PopoverClose,
//   PopoverTrigger,
//   PopoverArrow,
//   PopoverPortal,
//   PopoverAnchor,
// } from 'components/popover';
import Loading from 'components/loading';
import {
  Tooltip,
  TooltipContent,
  TooltipArrow,
  TooltipTrigger,
  TooltipPortal,
} from 'components/tooltip';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

import AlertsChart from './chart';
import { useAlerts } from './hooks';

const AlertsWidget = () => {
  const [widgetSettings, setWidgetSettings] = useRecoilState(habitatExtentSettings);
  const [selectedUnitAreaExtent, setUnitAreaExtent] = useState('km²');

  const { isLoading, data, isFetched, isPlaceholderData } = useAlerts({
    unit: selectedUnitAreaExtent,
  });

  // const { alerts, years, startDate, endDate } = data;

  const handleClick = useCallback(
    (year) => {
      setWidgetSettings(year);
    },
    [setWidgetSettings]
  );
  // const defaultYear = years[years.length - 1];
  // const year = widgetSettings;
  return (
    <div className={WIDGET_CARD_WRAPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <div>
          {/* <p className="text-lg font-light leading-7">
            There were {alerts} mangrove disturbance alerts between
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
                  {startDate}
                  <Icon
                    icon={ARROW_SVG}
                    className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2"
                  />
                </span>
              </TooltipTrigger>

              <TooltipPortal>
                <TooltipContent
                  side="bottom"
                  align="center"
                  className="rounded-[20x] bg-white  text-black/85 shadow-soft"
                >
                  <ul className={cn({ 'space-y-2': true })}>
                    {years?.map((y) => (
                      <li key={y}>
                        <button
                          className={cn({
                            'font-bold': true,
                            'hover:text-brand-800': year !== y,
                            'opacity-50': year === y,
                          })}
                          type="button"
                          onClick={() => handleClick(y)}
                          disabled={year === y}
                        >
                          {y || defaultYear}
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
                <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
                  {endDate}
                  <Icon
                    icon={ARROW_SVG}
                    className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2"
                  />
                </span>
              </TooltipTrigger>

              <TooltipPortal>
                <TooltipContent
                  side="bottom"
                  align="center"
                  className="rounded-[20x] bg-white  text-black/85 shadow-soft"
                >
                  <ul className={cn({ 'space-y-2': true })}>
                    {years?.map((y) => (
                      <li key={y}>
                        <button
                          className={cn({
                            'font-bold': true,
                            'hover:text-brand-800': year !== y,
                            'opacity-50': year === y,
                          })}
                          type="button"
                          onClick={() => handleClick(y)}
                          disabled={year === y}
                        >
                          {y || defaultYear}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <TooltipArrow className=" fill-white" width={10} height={5} />
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>
            .
          </p> */}
          {/* <AlertsChart legend={legend} config={config} /> */}
        </div>
      )}
    </div>
  );
};

export default AlertsWidget;
