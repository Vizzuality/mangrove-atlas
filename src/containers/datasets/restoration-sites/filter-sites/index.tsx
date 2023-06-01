import cn from 'lib/classnames';

import { RestorationSitesFilters } from 'store/widgets/restoration-sites';

import { useRecoilState } from 'recoil';

import { Checkbox, CheckboxIndicator, CheckboxRoot, CheckboxLabel } from 'components/checkbox';
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

import ARROW_SVG from 'svgs/ui/arrow.svg?sprite';

import { useMangroveRestorationSitesFilters } from '../hooks';
import { BUTTON_STYLES } from '../widget';

const FilterSites = () => {
  const [filters, setFilters] = useRecoilState(RestorationSitesFilters);
  const { isFetching, isFetched, data } = useMangroveRestorationSitesFilters();
  console.log(data, isFetched);
  return (
    <div className={WIDGET_CARD_WRAPER_STYLE}>
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && data && (
        <div className="space-y-4">
          <header className="flex justify-between">
            <h3 className="font-sans text-3xl font-light text-black/85">Filter Sites</h3>
            <button type="button" className="text-sm font-semibold text-brand-800">
              Clear all
            </button>
          </header>
          <div className="grid grid-cols-2 gap-5">
            {Object.keys(data.data).map((key) => (
              <Tooltip key="key">
                <TooltipTrigger asChild>
                  <div
                    className={cn({
                      ' first-line:after relative flex cursor-pointer items-center justify-between border border-brand-800 border-opacity-70':
                        true,
                      [BUTTON_STYLES]: true,
                    })}
                  >
                    <p className="first-letter:uppercase">{key.replaceAll('_', ' ')}</p>
                    <Icon
                      icon={ARROW_SVG}
                      className="h-2.5 w-2.5 -translate-x-1/2 stroke-brand-800 font-bold"
                    />
                  </div>
                </TooltipTrigger>

                <TooltipPortal>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    className="rounded-[20x] bg-white  text-black shadow-soft"
                  >
                    <ul
                      className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}
                    >
                      {data.data?.[key]?.map((u) => (
                        <Checkbox key={u}>
                          <CheckboxRoot>
                            <CheckboxIndicator />
                          </CheckboxRoot>
                          <CheckboxLabel>
                            <li>
                              <button
                                className={cn({
                                  'font-bold text-black': true,
                                })}
                                type="button"
                                // onClick={() => setUnitAreaExtent(u)}
                              >
                                {u}
                              </button>
                            </li>
                          </CheckboxLabel>
                        </Checkbox>
                      ))}
                    </ul>

                    <TooltipArrow className=" fill-white" width={10} height={5} />
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            ))}
          </div>
          <div className="flex w-full justify-end">
            <button
              className={cn({
                [BUTTON_STYLES]: true,
                'bg-brand-800 text-white': true,
              })}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSites;
