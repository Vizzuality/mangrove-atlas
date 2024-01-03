import { useState, useEffect, useCallback } from 'react';

import isEmpty from 'lodash-es/isEmpty';

import cn from 'lib/classnames';

import { RestorationSitesMapFilters } from 'store/widgets/restoration-sites';

import { useSetRecoilState } from 'recoil';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';
import Loading from 'components/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';
import { BUTTON_STYLES } from 'styles/widgets';

import FilterSites from './filter-sites';
import { useMangroveRestorationSites, useMangroveRestorationSitesFilters } from './hooks';
import SelectedFilters from './selected-filters';

const RestorationSitesWidget = () => {
  // filters component state to avoid refetch on every selection
  const [filters, setFilters] = useState<{ [key: string]: string[] | number[] }>({});

  // global filters state to update query
  const setMapFilters = useSetRecoilState<{ [key: string]: string[] | number[] }>(
    RestorationSitesMapFilters
  );

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
  }, [filtersData, filterKeys, filters]);

  const filtersSelected = Object.keys(filters).filter((key) => !!filters[key].length);

  const handleRemoveFilter = (key: string, slug: string) => {
    const filterToUpdate = filters[key] as string[];
    const updatedFilters: string[] = filterToUpdate?.filter((item) => item !== slug);

    setFilters({ ...filters, [key]: updatedFilters });
    setMapFilters({ ...filters, [key]: updatedFilters });
  };

  const handleClearAll = useCallback(() => {
    setMapFilters(filterKeys);
    setFilters(filterKeys);
  }, [setMapFilters, filterKeys]);

  if (!filtersData) return null;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-20" />
      {isFetched && data && (
        <div className="relative space-y-8">
          <p className={WIDGET_SENTENCE_STYLE}>
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
              {areFiltersSelected && (
                <button className="text-brand-800 underline" onClick={handleClearAll}>
                  Clear all
                </button>
              )}
            </div>
            <DialogContent className="h-fit-content w-[580px] rounded-3xl p-10">
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
