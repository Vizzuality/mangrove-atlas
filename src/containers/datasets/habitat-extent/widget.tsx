import { useCallback } from 'react';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { widgetYearAtom } from 'store/widget';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import Icon from 'components/icon';
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
  const currentYear = useRecoilValue(widgetYearAtom);
  const {
    query: { locationType, id },
  } = useRouter();
  const {
    data: { name, id: currentLocation, location_id },
  } = useLocation(locationType, id);

  const {
    area,
    mangroveCoastCoveragePercentage,
    totalLength,
    startYear,
    endYear,
    years,
    legend,
    config,
    isLoading,
  } = useMangroveHabitatExtent(
    {
      ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
      year: currentYear,
    },
    {}
  );

  const { tooltip } = config;
  const handleClick = useCallback((year) => {
    console.log(year);
  }, []);

  return (
    <div>
      {isLoading && <div>...loading</div>}
      {!isLoading && (
        <div>
          <p className="text-lg font-light leading-7">
            The area of mangrove habitat in <span className="font-bold"> {name}</span> was{' '}
            <span className="notranslate font-bold">{area} </span> in{' '}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
                  {startYear}
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
                  <ul>
                    {years?.map((year) => (
                      <li key={year} className={cn({ 'space-y-2': true })}>
                        <button type="button" onClick={() => handleClick(year)}>
                          {year}
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
            <span className="notranslate font-bold"> {totalLength} km</span> of the coastline.
          </p>
          <HabitatExtentChart legend={legend} config={config} />
        </div>
      )}
    </div>
  );
};

export default HabitatExtent;
