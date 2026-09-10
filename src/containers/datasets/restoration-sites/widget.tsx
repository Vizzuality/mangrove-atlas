import { useCallback, useState } from 'react';

import cn from '@/lib/classnames';

import { RestorationSitesMapFilters } from '@/store/widgets/restoration-sites';

import { DialogTitle } from '@radix-ui/react-dialog';
import { useSetAtom } from 'jotai';

import useIsPrintReport from '@/containers/print-report/use-is-print-report';

import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Loading from '@/components/ui/loading';
import { BUTTON_STYLES, WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import FilterSites from './filter-sites';
import { useMangroveRestorationSites, useMangroveRestorationSitesFilters } from './hooks';
import SelectedFilters from './selected-filters';

const RestorationSitesWidget = () => {
  const isPrintReport = useIsPrintReport();

  // filters component state to avoid refetch on every selection
  const [filters, setFilters] = useState<{ [key: string]: string[] | number[] }>({});

  // global filters state to update query
  const setMapFilters = useSetAtom(RestorationSitesMapFilters);

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

  // useEffect(() => {
  //   if (filtersData?.data && isEmpty(filters)) {
  //     setFilters(filterKeys);
  //   }
  // }, [filtersData, filterKeys, filters]);

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

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      {/* Covers the filters request too. This used to be `if (!filtersData) return null`, which
          removed the entire widget from the page until `/widgets/sites_filters` answered — on a slow
          response the card never appeared at all rather than showing a spinner. */}
      <Loading
        visible={isFetching || isFetchingFilters}
        iconClassName="flex w-10 h-10 m-auto my-20"
      />
      {isFetched && data && filtersData && (
        <div className="relative space-y-8">
          {data.data?.length > 0 && (
            <p className={WIDGET_SENTENCE_STYLE}>
              There are <span className="font-bold">{data.data?.length}</span> restoration sites in{' '}
              {data.location}
              {!areFiltersEmpty && ' that match your criteria'}.{!isPrintReport && <sup>*</sup>}
            </p>
          )}
          {data.data?.length === 0 && (
            <p>
              Sorry there are no results for this selection of filters for this area. Try another
              one
            </p>
          )}
          {/* Filtering and the MRTT footnote are both invitations to act, which
              a printed page cannot offer. */}
          <Dialog open={open} onOpenChange={setOpen}>
            <div
              className={cn({
                'flex justify-between text-xs': true,
                hidden: isPrintReport,
                'border-b-grey-50 border-b-2 pb-5': areFiltersSelected,
              })}
            >
              <DialogTrigger asChild>
                <button
                  className={cn({
                    'bg-brand-800 flex space-x-2 text-xs text-white': true,
                    [BUTTON_STYLES]: true,
                  })}
                >
                  <p>Filter sites</p>
                  {areFiltersSelected && (
                    <span className="text-brand-800 rounded-full bg-white px-1.5">
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
            {/* Let the card grow with content and the outer wrapper scroll, so an
                expanded filter dropdown overlays instead of being clipped by the card's
                overflow (see dialog default scroll box). */}
            <DialogContent
              className="max-h-none overflow-y-visible sm:max-h-none"
              classNameContent="overflow-y-auto"
              hideScrollFade
            >
              <DialogTitle className="sr-only">Filter sites</DialogTitle>
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
          <div className={cn({ 'text-sm': true, hidden: isPrintReport })}>
            <sup>*</sup>As entered into the Mangrove Restoration Tracker Tool. Enter your data{' '}
            {/* "here" is meaningless out of context, and screen reader users often navigate by a
                list of links alone — aria-label gives this one a name that stands on its own. */}
            <a
              href={process.env.NEXT_PUBLIC_MRTT_SITE}
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Enter your data in the Mangrove Restoration Tracker Tool"
              className="text-brand-800 font-semibold underline"
            >
              here
            </a>
            .
          </div>
        </div>
      )}
    </div>
  );
};

export default RestorationSitesWidget;
