import { useState } from 'react';

import cn from 'lib/classnames';

import NoData from 'containers/widgets/no-data';

import Icon from 'components/ui/icon';
import Loading from 'components/ui/loading';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import {
  WIDGET_CARD_WRAPPER_STYLE,
  WIDGET_SENTENCE_STYLE,
  WIDGET_SELECT_STYLES,
  WIDGET_SELECT_ARROW_STYLES,
} from 'styles/widgets';

import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

import CarbonMarketPotentialChart from './chart';
import { useCarbonMarketPotential } from './hooks';
import type { Unit } from './types';
import { trackEvent } from 'lib/analytics/ga';

const CarbonMarketPotentialWidget = () => {
  const [unit, setUnit] = useState<Unit>({
    label: 'ha',
    value: 'ha',
  });
  const [label, setLabel] = useState('at $5/ton');

  const { isLoading, isFetched, isPlaceholderData, data } = useCarbonMarketPotential({
    units: unit.value,
    label,
  });

  const { noData, location, units, labels, config, investibleBlueCarbonValue } = data;

  if (noData) return <NoData />;

  const { legend } = config;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <div>
          <p className={WIDGET_SENTENCE_STYLE}>
            The extent of investible blue carbon (ha) at{' '}
            <Popover>
              <PopoverTrigger asChild>
                <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                  {label}
                  <Icon
                    icon={ARROW_SVG}
                    className={`${`${WIDGET_SELECT_ARROW_STYLES} print:hidden`} print:hidden`}
                    description="Arrow"
                  />
                </span>
              </PopoverTrigger>

              <PopoverContent className="rounded-2xl px-2 shadow-border">
                <ul className="max-h-32 space-y-0.5">
                  {labels?.map((l) => (
                    <li key={l}>
                      <button
                        className={cn({
                          'font-bold': true,
                          'hover:text-brand-800': label !== l,
                          'opacity-50': label === l,
                        })}
                        type="button"
                        onClick={() => {
                          // Google Analytics tracking
                          trackEvent('Widget iteration - rate change in carbon market potential', {
                            action: 'Widget iteration - rate change in carbon market potential',
                            label: `Widget iteration - carbon market potential rate to ${l}`,
                          });
                          setLabel(l);
                        }}
                        disabled={label === l}
                      >
                        {l}
                      </button>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>{' '}
            in <span className="font-bold"> {location}</span> is {investibleBlueCarbonValue}{' '}
            <Popover>
              <PopoverTrigger asChild>
                <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                  {unit.label}
                  <Icon
                    icon={ARROW_SVG}
                    className={`${WIDGET_SELECT_ARROW_STYLES} print:hidden`}
                    description="Arrow"
                  />
                </span>
              </PopoverTrigger>

              <PopoverContent className="rounded-2xl px-2 shadow-border">
                <ul className="max-h-32 space-y-0.5">
                  {units?.map((u) => (
                    <li key={u.label}>
                      <button
                        aria-label="set unit"
                        className={cn({
                          'font-bold': true,
                          'hover:text-brand-800': unit !== u,
                          'opacity-50': unit === u,
                        })}
                        type="button"
                        onClick={() => {
                          // Google Analytics tracking
                          trackEvent('Widget iteration - unit change in carbon market potential', {
                            action: 'Widget iteration - unit change in carbon market potential',
                            label: `Widget iteration - carbon market potential unit to ${u}`,
                          });
                          setUnit(u);
                        }}
                        disabled={unit === u}
                      >
                        {u.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          </p>
          <CarbonMarketPotentialChart legend={legend} config={config} />
        </div>
      )}
    </div>
  );
};

export default CarbonMarketPotentialWidget;
