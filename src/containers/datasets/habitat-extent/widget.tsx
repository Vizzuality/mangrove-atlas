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

import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

import HabitatExtentChart from './chart';
import { useMangroveHabitatExtent } from './hooks';

const HabitatExtent = () => {
  const [widgetSettings, setWidgetSettings] = useRecoilState(habitatExtentSettings);
  const [selectedUnitAreaExtent, setUnitAreaExtent] = useState('km²');

  const { isLoading, data, isFetched, isPlaceholderData } = useMangroveHabitatExtent({
    unit: selectedUnitAreaExtent,
  });

  const {
    area,
    location,
    mangroveCoastCoveragePercentage,
    totalLength,
    years,
    defaultYear,
    legend,
    unitOptions,
    config,
    defaultUnitLinearCoverage,
  } = data;

  const handleClick = useCallback(
    (year) => {
      setWidgetSettings(year);
    },
    [setWidgetSettings]
  );

  const year = widgetSettings;

  return (
    <div>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <div>
          <p className="text-lg font-light leading-7">
            The area of mangrove habitat in <span className="font-bold"> {location}</span> was{' '}
            <span className="notranslate font-bold">
              {area}{' '}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
                    {selectedUnitAreaExtent}
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
                      {unitOptions?.map((u) => (
                        <li key={u}>
                          <button
                            className={cn({
                              'font-bold': true,
                              'hover:text-brand-800': selectedUnitAreaExtent !== u,
                              'opacity-50': selectedUnitAreaExtent === u,
                            })}
                            type="button"
                            onClick={() => setUnitAreaExtent(u)}
                            disabled={selectedUnitAreaExtent === u}
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
            </span>{' '}
            in{' '}
            {/* <PopoverRoot modal={false} open={true}>
              <PopoverTrigger asChild>
                <button className="font-bold">
                  {year || defaultYear}
                  <Icon
                    icon={ARROW_SVG}
                    className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2"
                  />
                </button>
              </PopoverTrigger>
              <PopoverAnchor />
              <PopoverPortal>
                <PopoverContent className="rounded-lg bg-white p-5 text-black/85 shadow-soft">
                  <ul>
                    {years?.map((y) => (
                      <li key={y} className={cn({ 'space-y-2': true })}>
                        <button
                          className={cn({
                            'hover:font-bold': year !== y,
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
                </PopoverContent>
              </PopoverPortal>
            </PopoverRoot> */}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
                  {year || defaultYear}
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
            , this represents a linear coverage of{' '}
            <span className="font-bold">{mangroveCoastCoveragePercentage}%</span> of the
            <span className="notranslate font-bold">
              {' '}
              {totalLength} {defaultUnitLinearCoverage}
            </span>{' '}
            of the coastline.
          </p>
          <HabitatExtentChart legend={legend} config={config} />
        </div>
      )}
    </div>
  );
};

export default HabitatExtent;
