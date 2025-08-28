import { useState } from 'react';

import cn from 'lib/classnames';

import { habitatChangeEndYear, habitatChangeStartYear } from 'store/widgets/habitat-change';

import { useRecoilState } from 'recoil';

import NoData from 'containers/widgets/no-data';

import Chart from 'components/chart';
import Icon from 'components/ui/icon';
import Loading from 'components/ui/loading';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import {
  WIDGET_CARD_WRAPPER_STYLE,
  WIDGET_SELECT_ARROW_STYLES,
  WIDGET_SELECT_STYLES,
  WIDGET_SENTENCE_STYLE,
} from 'styles/widgets';

import TRIANGLE_SVG from 'svgs/ui/arrow-filled.svg?sprite';
import ARROW_SVG from 'svgs/ui/arrow.svg?sprite';

import { useMangroveHabitatChange } from './hooks';
import { UseParamsOptions } from './types';
import { trackEvent } from 'lib/analytics/ga';

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
    years,
    config,
    currentStartYear,
    currentEndYear,
    isFetched,
    isPlaceholderData,
    noData,
    isLoading,
  } = useMangroveHabitatChange({ startYear, endYear, limit });

  if (noData) return <NoData />;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <div>
          <p className={WIDGET_SENTENCE_STYLE}>
            Worldwide the {limit} countries with the largest net change in Mangrove habitat extent
            between
            <span className="notranslate font-bold">
              {' '}
              <Popover>
                <PopoverTrigger asChild>
                  <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                    {' '}
                    {currentStartYear}
                    <Icon
                      icon={TRIANGLE_SVG}
                      className={`${WIDGET_SELECT_ARROW_STYLES} print:hidden`}
                      description="Arrow"
                    />
                  </span>
                </PopoverTrigger>
                <PopoverContent className="rounded-2xl px-2 shadow-border">
                  <ul className="z-20 max-h-56 space-y-0.5">
                    {years?.map((y) => (
                      <li key={y}>
                        <button
                          aria-label="Select start year"
                          className={cn({
                            'rounded-lg py-1 px-2 hover:bg-brand-800/20': true,
                            'font-semibold text-brand-800': currentStartYear === y,
                            'pointer-events-none opacity-50':
                              y > currentEndYear || currentEndYear === y,
                          })}
                          type="button"
                          onClick={() => {
                            // Google Analytics tracking
                            trackEvent('Widget iteration - start date change in habitat change', {
                              category: 'Widget iteration',
                              action: 'Select',
                              label: `Widget iteration - change start date in habitat change to ${y}`,
                              value: y,
                            });
                            setStartYear(y);
                          }}
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
            </span>
            and{' '}
            <span className="notranslate font-bold">
              <Popover>
                <PopoverTrigger asChild>
                  <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                    {currentEndYear}
                    <Icon
                      icon={TRIANGLE_SVG}
                      className={`${WIDGET_SELECT_ARROW_STYLES} print:hidden`}
                      description="Arrow"
                    />
                  </span>
                </PopoverTrigger>

                <PopoverContent className="rounded-2xl px-2 shadow-border">
                  <ul className="z-20 max-h-56 space-y-0.5">
                    {years?.map((y) => (
                      <li key={y}>
                        <button
                          aria-label="select end year"
                          className={cn({
                            'rounded-lg py-1 px-2 hover:bg-brand-800/20': true,
                            'font-semibold text-brand-800': currentEndYear === y,
                            'pointer-events-none opacity-50':
                              y < currentStartYear || currentStartYear === y,
                          })}
                          type="button"
                          onClick={() => {
                            // Google Analytics tracking
                            trackEvent('Widget iteration - end date change in habitat change', {
                              category: 'Widget iteration',
                              action: 'Select',
                              label: `Widget iteration - change end date in habitat change to ${y}`,
                            });
                            setEndYear(y);
                          }}
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
              </Popover>{' '}
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
          <div className="w-full print:scale-x-90 print:transform">
            <Chart config={config} />
          </div>

          <button
            aria-label="set number of countries to show"
            type="button"
            className="flex w-full items-center justify-center space-x-2 text-sm font-semibold text-brand-800"
            onClick={() => {
              const newLimit = limit === 5 ? 10 : 5;
              // Google Analytics tracking
              trackEvent('Widget iteration - limit change in habitat change', {
                category: 'Widget iteration',
                action: 'Select',
                label: `Widget iteration - change limit in habitat change to ${newLimit}`,
                value: newLimit,
              });
              setLimit(newLimit);
            }}
          >
            <span>{limit === 5 ? 'Show 10' : 'Show 5'}</span>
            <Icon
              icon={ARROW_SVG}
              className={cn({
                'inline-block h-2 w-2 fill-current text-brand-800': true,
                'rotate-180 transform': limit === 10,
              })}
              description="Arrow"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default HabitatExtent;
