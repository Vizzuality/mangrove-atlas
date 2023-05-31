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
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

import { useMangroveRestorationSitesFilters } from '../hooks';

const FilterSites = () => {
  const { isFetching, isFetched, data } = useMangroveRestorationSitesFilters();
  console.log(Object.keys(data.data));

  return (
    <div className={WIDGET_CARD_WRAPER_STYLE}>
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && data && (
        <>
          <header className="flex justify-between">
            <h3>Filter Sites</h3>
            <button type="button">Clear all</button>
          </header>
          <div>
            {Object.keys(data.data).map((key) => (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
                    {key}
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
                      {data.data[key]?.map((u) => (
                        <li key={u}>
                          <button
                            className={cn({
                              'font-bold': true,
                            })}
                            type="button"
                            // onClick={() => setUnitAreaExtent(u)}
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
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FilterSites;
