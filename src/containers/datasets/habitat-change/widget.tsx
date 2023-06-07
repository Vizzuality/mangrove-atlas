import { useState } from 'react';

import cn from 'lib/classnames';

import { habitatChangeStartYear, habitatChangeEndYear } from 'store/widgets/habitat-change';

import { useRecoilState } from 'recoil';

import Chart from 'components/chart';
import Icon from 'components/icon';
import Loading from 'components/loading';
import {
  Tooltip,
  TooltipContent,
  TooltipArrow,
  TooltipTrigger,
  TooltipPortal,
} from 'components/tooltip';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

import TRIANGLE_SVG from 'svgs/ui/arrow-filled.svg?sprite';
import ARROW_SVG from 'svgs/ui/arrow.svg?sprite';

import { useMangroveHabitatChange } from './hooks';
import { UseParamsOptions } from './types';

const labelsForLayer = [
  {
    color: 'rgba(0,0,0,0.7)',
    label: 'Net change',
  },
  // {
  //   color: '#A6CB10',
  //   label: 'Gain',
  // },
  // {
  //   color: '#EB6240',
  //   label: 'Loss',
  // }, TO - DO - add back when client fixes data for gain and loss
];
const HabitatExtent = () => {
  const [startYear, setStartYear] = useRecoilState(habitatChangeStartYear);
  const [endYear, setEndYear] = useRecoilState(habitatChangeEndYear);
  const [limit, setLimit] = useState<UseParamsOptions['limit']>(5);

  const {
    location,
    years,
    config,
    currentStartYear,
    currentEndYear,
    isFetched,
    isPlaceholderData,
    noData,
  } = useMangroveHabitatChange({ startYear, endYear, limit });

  const isLoading = false;
  if (noData) return null;
  return (
    <div className={WIDGET_CARD_WRAPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <div>
          <p className="first-letter:uppercase">
            <span className="font-bold first-letter:uppercase"> {location}</span> the {limit}{' '}
            countries with the largest net change in Mangrove habitat extent between
            <span className="notranslate font-bold">
              {' '}
              <Tooltip>
                <TooltipTrigger>
                  <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
                    {currentStartYear}
                    <Icon
                      icon={TRIANGLE_SVG}
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
                    <ul
                      className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}
                    >
                      {years?.map((y) => (
                        <li key={y}>
                          <button
                            className={cn({
                              'font-bold': true,
                              'text-brand-800': currentStartYear === y,
                              'hover:text-brand-800': currentStartYear !== y && y < currentEndYear,
                              'opacity-50':
                                currentStartYear === y ||
                                y > currentEndYear ||
                                currentEndYear === y,
                            })}
                            type="button"
                            onClick={() => setStartYear(y)}
                            disabled={
                              currentStartYear === y || y > currentEndYear || currentEndYear === y
                            }
                          >
                            {y}
                          </button>
                        </li>
                      ))}
                    </ul>

                    <TooltipArrow />
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>{' '}
            </span>
            and{' '}
            <span className="notranslate font-bold">
              <Tooltip>
                <TooltipTrigger>
                  <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
                    {currentEndYear}
                    <Icon
                      icon={TRIANGLE_SVG}
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
                    <ul
                      className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}
                    >
                      {years?.map((y) => (
                        <li key={y}>
                          <button
                            className={cn({
                              'font-bold': true,
                              'text-brand-800': currentEndYear === y,
                              'hover:text-brand-800': currentEndYear !== y && y > currentStartYear,
                              'opacity-50': y < currentStartYear || currentStartYear === y,
                            })}
                            type="button"
                            onClick={() => setEndYear(y)}
                            disabled={
                              currentEndYear === y || y < currentStartYear || currentStartYear === y
                            }
                          >
                            {y}
                          </button>
                        </li>
                      ))}
                    </ul>

                    <TooltipArrow />
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>{' '}
            </span>
            were:{' '}
          </p>
          <ul className="flex justify-end space-x-4 py-4">
            {labelsForLayer?.map((d) => (
              <li key={`item-${d.label}`} className="inline-flex items-center space-x-2">
                <div
                  className={cn({
                    'h-2 w-4 rounded-r-md': true,
                  })}
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-sm font-bold text-black/85">{d.label}</span>
              </li>
            ))}
          </ul>
          <Chart config={config} />

          <button
            type="button"
            className="flex w-full items-center justify-center space-x-2 text-sm font-semibold text-brand-800"
            onClick={() => setLimit(limit === 5 ? 10 : 5)}
          >
            <span>{limit === 5 ? 'Show 10' : 'Show 5'}</span>
            <Icon
              icon={ARROW_SVG}
              className={cn({
                'inline-block h-2 w-2 fill-current text-brand-800': true,
                'rotate-180 transform ': limit === 10,
              })}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default HabitatExtent;
