import { useState } from 'react';

import cn from 'lib/classnames';

import Icon from 'components/icon';
import Loading from 'components/loading';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from 'components/tooltip';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

import CarbonMarketPotentialChart from './chart';
import { useCarbonMarketPotential } from './hooks';
import type { Unit } from './types';

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

  if (noData) return null;

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
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
                  {label}
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
                  className="rounded-3xl bg-white  text-black/85 shadow-soft"
                >
                  <ul className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}>
                    {labels?.map((l) => (
                      <li key={l}>
                        <button
                          className={cn({
                            'font-bold': true,
                            'hover:text-brand-800': label !== l,
                            'opacity-50': label === l,
                          })}
                          type="button"
                          onClick={() => setLabel(l)}
                          disabled={label === l}
                        >
                          {l}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <TooltipArrow className="fill-white" width={10} height={5} />
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>{' '}
            in <span className="font-bold"> {location}</span> is {investibleBlueCarbonValue}{' '}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
                  {unit.label}
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
                  className="rounded-3xl] bg-white  text-black/85 shadow-soft"
                >
                  <ul className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}>
                    {units?.map((u) => (
                      <li key={u.label}>
                        <button
                          className={cn({
                            'font-bold': true,
                            'hover:text-brand-800': unit !== u,
                            'opacity-50': unit === u,
                          })}
                          type="button"
                          onClick={() => setUnit(u)}
                          disabled={unit === u}
                        >
                          {u.label}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <TooltipArrow className=" fill-white" width={10} height={5} />
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>
          </p>
          <CarbonMarketPotentialChart legend={legend} config={config} />
        </div>
      )}
    </div>
  );
};

export default CarbonMarketPotentialWidget;
