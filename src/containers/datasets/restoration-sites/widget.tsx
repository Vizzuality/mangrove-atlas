import { useState, useEffect } from 'react';

import isEmpty from 'lodash-es/isEmpty';

import cn from 'lib/classnames';

import { RestorationSitesMapFilters } from 'store/widgets/restoration-sites';

import { useSetRecoilState } from 'recoil';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';
import Loading from 'components/loading';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

import FilterSites from './filter-sites';
import { useMangroveRestorationSites, useMangroveRestorationSitesFilters } from './hooks';
import SelectedFilters from './selected-filters';

export const BUTTON_STYLES = 'rounded-[20px] py-1 px-4 text-sm font-semibold';

const RestorationSitesWidget = () => {
  // filters component state to avoid refetch on every selection
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});

  // global filters state to update query
  const setMapFilters = useSetRecoilState<{ [key: string]: string[] }>(RestorationSitesMapFilters);

  const [open, setOpen] = useState(false);

  // fetch data and filters
  const { isFetching, isFetched, data } = useMangroveRestorationSites();
  const {
    isFetching: isFetchingFilters,
    isFetched: isFetchedFilters,
    data: filtersData,
  } = useMangroveRestorationSitesFilters();

  const areFiltersEmpty = Object.values(filters).every((value) => value.length === 0);
  const totalLength = Object.values(filters).reduce((acc, array) => acc + array.length, 0);
  const areFiltersSelected = totalLength > 0;
  const filterKeys =
    filtersData?.data &&
    Object.keys(filtersData?.data).reduce((acc, key) => ({ ...acc, [key]: [] }), {});

  useEffect(() => {
    if (filtersData?.data && isEmpty(filters)) {
      setFilters(filterKeys);
    }
  }, [filtersData]);

  const filtersSelected = Object.keys(filters).filter((key) => !!filters[key].length);

  const handleRemoveFilter = (key: string, slug: string) => {
    const filtersCopy = { ...filters };
    const array = filtersCopy[key];

    if (array?.includes(slug)) {
      filtersCopy[key] = array.filter((item) => item !== slug);
    }

    setFilters(filtersCopy);
    setMapFilters(filtersCopy);
  };

  return (
    <div className={WIDGET_CARD_WRAPER_STYLE}>
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-20" />
      {isFetched && data && (
        <div className="relative space-y-8">
          <p>
            There are <span className="font-bold">{data.data?.length}</span> restoration sites in{' '}
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
              <button
                className="text-brand-800 underline"
                onClick={() => {
                  setMapFilters(filterKeys);
                  setFilters(filterKeys);
                }}
              >
                Clear all
              </button>
            </div>
            <DialogContent className="h-fit-content w-[580px] rounded-[20px] p-10">
              <FilterSites
                open={open}
                onChangeModalVisibility={setOpen}
                filters={filters}
                data={filtersData?.data}
                setFilters={setFilters}
                isFetching={isFetchingFilters}
                isFetched={isFetchedFilters}
                filterKeys={filterKeys}
              />
              <DialogClose />
            </DialogContent>
          </Dialog>
          {areFiltersSelected && (
            <SelectedFilters
              filters={filters}
              handleRemoveFilter={handleRemoveFilter}
              filtersSelected={filtersSelected}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RestorationSitesWidget;
