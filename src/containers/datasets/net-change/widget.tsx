import { useState } from 'react';

import cn from 'lib/classnames';

import { netChangeStartYear, netChangeEndYear } from 'store/widgets/net-change';

import { useRecoilState } from 'recoil';

import Icon from 'components/icon';
import Loading from 'components/loading';
import {
  Tooltip,
  TooltipContent,
  TooltipArrow,
  TooltipTrigger,
  TooltipPortal,
} from 'components/tooltip';

import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

import NetChangeChart from './chart';
import { useMangroveNetChange } from './hooks';

const NetChangeWidget = () => {
  const [selectedUnit, setUnit] = useState('km²');
  const [startYear, setStartYear] = useRecoilState(netChangeStartYear);
  const [endYear, setEndYear] = useRecoilState(netChangeEndYear);

  const {
    isLoading,
    netChange,
    direction,
    config,
    location,
    unitOptions,
    years,
    isFetched,
    isPlaceholderData,
    currentEndYear,
    currentStartYear,
  } = useMangroveNetChange({
    selectedUnit,
    startYear,
    endYear,
  });

  return (
    <div>
      <Loading
        visible={isPlaceholderData || isLoading}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <div>
          <p>
            The extent of mangroves in <span className="font-bold"> {location}</span> has{' '}
            <span className="font-bold"> {direction}</span> by{' '}
            <span className="font-bold"> {netChange}</span>{' '}
            <Tooltip>
              <TooltipTrigger asChild>
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
                  <ul className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}>
                    {unitOptions?.map((u) => (
                      <li key={u}>
                        <button
                          className={cn({
                            'font-bold': true,
                            'hover:text-brand-800': selectedUnit !== u,
                            'opacity-50': selectedUnit === u,
                          })}
                          type="button"
                          onClick={() => setUnit(u)}
                          disabled={selectedUnit === u}
                        >
                          {u}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <TooltipArrow className=" fill-white" width={10} height={5} />
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>{' '}
            between{' '}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
                  {currentStartYear}
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
                  <ul className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}>
                    {years?.map((u) => (
                      <li key={u}>
                        <button
                          className={cn({
                            'font-bold': true,
                            'text-brand-800': currentStartYear === u,
                            'hover:text-brand-800': currentStartYear !== u && u < currentEndYear,
                            'opacity-50':
                              currentStartYear === u || u > currentEndYear || currentEndYear === u,
                          })}
                          type="button"
                          onClick={() => setStartYear(u)}
                          disabled={
                            currentStartYear === u || u > currentEndYear || currentEndYear === u
                          }
                        >
                          {u}
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
                  {currentEndYear}
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
                  <ul className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}>
                    {years?.map((u) => (
                      <li key={u}>
                        <button
                          className={cn({
                            'font-bold': true,
                            'text-brand-800': currentEndYear === u,
                            'hover:text-brand-800': currentEndYear !== u && u > currentStartYear,
                            'opacity-50': u < currentStartYear || currentStartYear === u,
                          })}
                          type="button"
                          onClick={() => setEndYear(u)}
                          disabled={
                            currentEndYear === u || u < currentStartYear || currentStartYear === u
                          }
                        >
                          {u}
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

          <NetChangeChart config={config} />
        </div>
      )}
    </div>
  );
};

export default NetChangeWidget;
