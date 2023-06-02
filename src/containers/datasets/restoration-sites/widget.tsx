import { useState } from 'react';

import cn from 'lib/classnames';

import { RestorationSitesFilters } from 'store/widgets/restoration-sites';

import { useRecoilState } from 'recoil';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';
import Loading from 'components/loading';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite';

import FilterSites from './filter-sites';
import { useMangroveRestorationSites, useEmptyFilters } from './hooks';

export const BUTTON_STYLES = 'rounded-[20px] py-1 px-4 text-sm font-semibold';
const RestorationSitesWidget = () => {
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});
  const [open, setOpen] = useState(false);

  const { isFetching, isFetched, data } = useMangroveRestorationSites();
  console.log(isFetching);
  const areFiltersEmpty = useEmptyFilters(filters);
  const totalLength = Object.values(filters).reduce((acc, array) => acc + array.length, 0);
  const areFiltersSelected = totalLength > 0;
  return (
    <div className={WIDGET_CARD_WRAPER_STYLE}>
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && data && (
        <div className="space-y-8">
          <p>
            There are <span className="font-bold">{data.data.length}</span> restoration sites in{' '}
            {data.location}
            {!areFiltersEmpty && ' that match your criteria'}.
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <div
              className={cn({
                'flex justify-between text-xs': true,
                'border-b-2 border-b-grey-50 pb-5': areFiltersSelected,
              })}
            >
              <DialogTrigger>
                <button
                  className={cn({
                    'flex space-x-2 bg-brand-800 text-xs text-white': true,
                    [BUTTON_STYLES]: true,
                  })}
                >
                  <p>Filter sites</p>{' '}
                  {areFiltersSelected && (
                    <span className="rounded-full bg-white px-1.5 text-brand-800">
                      {totalLength}
                    </span>
                  )}
                </button>
              </DialogTrigger>
              <button className="text-brand-800 underline" onClick={() => setFilters({})}>
                Clear all
              </button>
            </div>
            <DialogContent className="h-fit-content w-[580px] rounded-[20px] p-10">
              <FilterSites open={open} onChangeModalVisibility={setOpen} />
              <DialogClose />
            </DialogContent>
          </Dialog>
          {areFiltersSelected && (
            <div>
              {Object.values(filters).map(
                (filter) =>
                  filter.length > 0 && (
                    <div className="bg-red-500">
                      <button
                        type="button"
                        className={cn({
                          [BUTTON_STYLES]: true,
                          ' flex items-center space-x-2 overflow-hidden text-ellipsis whitespace-nowrap bg-[#00857f26] py-10 text-sm text-black/85':
                            true,
                        })}
                      >
                        <div>
                          <Icon icon={CLOSE_SVG} className="mr-1 block h-3 w-3" />
                        </div>

                        <p className="whitespace overflow-hidden text-ellipsis">{filter}</p>
                      </button>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RestorationSitesWidget;
