import { SetStateAction, Dispatch } from 'react';

import cn from 'lib/classnames';

import { RestorationSitesMapFilters } from 'store/widgets/restoration-sites';

import { useSetRecoilState } from 'recoil';

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

import type { DataSites } from '../types';
import { BUTTON_STYLES } from '../widget';

type FilterSitesProps = {
  open: boolean;
  onChangeModalVisibility: Dispatch<SetStateAction<boolean>>;
  filters: { [key: string]: string[] };
  data: DataSites[];
  setFilters: Dispatch<SetStateAction<{ [key: string]: string[] }>>;
  isFetching: boolean;
  isFetched: boolean;
  filterKeys: { [key: string]: string[] };
};
const FilterSites = ({
  filters,
  setFilters,
  data,
  onChangeModalVisibility,
  open,
  isFetching,
  isFetched,
  filterKeys,
}: FilterSitesProps) => {
  const setMapFilters = useSetRecoilState<{ [key: string]: string[] }>(RestorationSitesMapFilters);
  const handleFiltersChange = (slug: string, key: string) => {
    const filtersCopy = { ...filters };
    if (key in filtersCopy) {
      const array = filtersCopy[key];

      if (array.includes(slug)) {
        filtersCopy[key] = array.filter((item) => item !== slug);
      } else {
        filtersCopy[key] = [...array, slug];
      }
    }
    return setFilters(filtersCopy);
  };

  const areFiltersEmpty = Object.values(filters).every((value) => value.length === 0);

  const handleFiltersApplication = () => {
    onChangeModalVisibility(!open);
    setMapFilters(filters);
  };

  const resetFilters = () => {
    setMapFilters(filterKeys);
    setFilters(filterKeys);
  };

  return (
    <div className={WIDGET_CARD_WRAPER_STYLE}>
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && (
        <div className="space-y-4">
          <header className="flex justify-between">
            <h3 className="font-sans text-3xl font-light text-black/85">Filter Sites</h3>
            <button
              type="button"
              className="text-sm font-semibold text-brand-800"
              onClick={resetFilters}
            >
              Clear all
            </button>
          </header>
          <div className="grid grid-cols-2 gap-4 py-10">
            {Object.keys(data).map((key) => (
              <Tooltip key="key">
                <TooltipTrigger asChild>
                  <div
                    className={cn({
                      [BUTTON_STYLES]: true,
                      'first-line:after relative flex cursor-pointer items-center justify-between border border-brand-800 border-opacity-70 px-2.5':
                        true,
                    })}
                  >
                    <div className="flex space-x-2">
                      <p className="first-letter:uppercase">{key.replaceAll('_', ' ')}</p>
                      {filters?.[key]?.length > 0 && (
                        <span className="rounded-full bg-brand-800 px-2 text-[10px] font-bold text-white">
                          {filters?.[key]?.length}
                        </span>
                      )}
                    </div>
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
                      className={cn({
                        'flex flex-col items-start justify-start space-y-2 overflow-y-auto scrollbar-hide':
                          true,
                      })}
                    >
                      <Checkbox className="flex flex-col space-y-4">
                        {data?.[key]?.map((u) => (
                          <div key={u} className="flex items-center">
                            <CheckboxRoot
                              name={u}
                              value={u}
                              checked={filters?.[key]?.includes(u)}
                              onCheckedChange={() => handleFiltersChange(u, key)}
                            >
                              <CheckboxIndicator className="text-brand-800 last:pb-0" />
                            </CheckboxRoot>
                            <CheckboxLabel className="text-sm">
                              <li>
                                <button
                                  className="font-bold text-black"
                                  type="button"
                                  onClick={() => handleFiltersChange(u, key)}
                                >
                                  {u}
                                </button>
                              </li>
                            </CheckboxLabel>
                          </div>
                        ))}
                      </Checkbox>
                    </ul>

                    <TooltipArrow className="fill-white" width={10} height={5} />
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
                'opacity-50': areFiltersEmpty,
              })}
              disabled={areFiltersEmpty}
              onClick={handleFiltersApplication}
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
