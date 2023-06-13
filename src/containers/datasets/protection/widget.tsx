import { useState } from 'react';

import cn from 'lib/classnames';

import Icon from 'components/icon';
import Loading from 'components/loading';
import {
  Tooltip,
  TooltipContent,
  TooltipArrow,
  TooltipTrigger,
  TooltipPortal,
} from 'components/tooltip';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

import ProtectionChart from './chart';
import { useMangroveProtectedAreas } from './hooks';
const Protection = () => {
  const [selectedUnit, setUnit] = useState('ha');
  const { data, isFetched, isFetching } = useMangroveProtectedAreas({ unit: selectedUnit });

  if (!Object.keys(data || {}).length) return null;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading visible={isFetching && !isFetched} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && data && (
        <div className="space-y-4">
          <p className={WIDGET_SENTENCE_STYLE}>
            Mangroves found in protected areas in{' '}
            <span className="font-bold">{data.location} </span> in{' '}
            <span className="font-bold">{data.currentYear} </span> represented{' '}
            <span className="font-bold">
              {data.protectedArea}{' '}
              <Tooltip>
                <TooltipTrigger>
                  <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
                    {selectedUnit}
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
                    <ul
                      className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}
                    >
                      {data.units?.map((u) => (
                        <li key={u}>
                          <button
                            className={cn({
                              'font-bold': true,
                              'text-brand-800': selectedUnit === u,
                              'hover:text-brand-800': selectedUnit !== u,
                              'opacity-50': selectedUnit === u,
                            })}
                            type="button"
                            onClick={() => setUnit(u)}
                          >
                            {u}
                          </button>
                        </li>
                      ))}
                    </ul>

                    <TooltipArrow />
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            </span>{' '}
            out of a total <span className="font-bold">{data.totalArea}</span>{' '}
            <Tooltip>
              <TooltipTrigger>
                <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
                  {selectedUnit}
                  <Icon
                    icon={ARROW_SVG}
                    className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2"
                  />
                </span>
              </TooltipTrigger>
              .
              <TooltipPortal>
                <TooltipContent
                  side="bottom"
                  align="center"
                  className="rounded-[20x] bg-white  text-black/85 shadow-soft"
                >
                  <ul className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}>
                    {data.units?.map((u) => (
                      <li key={u}>
                        <button
                          className={cn({
                            'font-bold': true,
                            'text-brand-800': selectedUnit === u,
                            'hover:text-brand-800': selectedUnit !== u,
                            'opacity-50': selectedUnit === u,
                          })}
                          type="button"
                          onClick={() => setUnit(u)}
                        >
                          {u}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <TooltipArrow />
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>
          </p>
          <ProtectionChart config={data.config} legend={data.legend} />
          <p className="text-sm italic">
            Note: This represents the proportion of mangroves known to occur within protected areas.
            The level and the effectiveness of protection of these mangroves however are unknown.
          </p>
        </div>
      )}
    </div>
  );
};

export default Protection;
