import { SetStateAction, Dispatch, useMemo } from 'react';
import React from 'react';

import cn from 'lib/classnames';

import { RestorationSitesMapFilters } from 'store/widgets/restoration-sites';

import { useSetRecoilState } from 'recoil';

import Loading from 'components/loading';
import MultiSelect from 'components/select-multi';
import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import type { DataSites } from '../types';
import { BUTTON_STYLES } from '../widget';

type FilterSitesProps = {
  open: boolean;
  onChangeModalVisibility: Dispatch<SetStateAction<boolean>>;
  filters: { [key: string]: string[] | number[] };
  data: DataSites[];
  setFilters: Dispatch<SetStateAction<{ [key: string]: string[] | number[] }>>;
  isFetching: boolean;
  isFetched: boolean;
  filterKeys: { [key: string]: string[] | number[] };
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
  const setMapFilters = useSetRecoilState<{ [key: string]: string[] | number[] }>(
    RestorationSitesMapFilters
  );

  const handleFiltersApplication = () => {
    onChangeModalVisibility(!open);
    setMapFilters(filters);
  };

  const resetFilters = () => {
    setMapFilters(filterKeys);
    setFilters(filterKeys);
  };

  const selectFilters = useMemo(() => {
    return Object.keys(data)?.map((key) => ({
      id: key,
      name: key.replaceAll('_', ' '),
      options: data[key]?.map((value) => ({ label: value, value })),
    }));
  }, [data]);

  const areFiltersEmpty = useMemo(
    () => Object.values(filters).every((value) => value.length === 0),
    [filters]
  );

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
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
            {selectFilters.map(({ name, id, options }) => (
              <MultiSelect
                key={id}
                id={id}
                name={name}
                size="s"
                placeholder={name}
                options={options}
                values={filters[id] || []}
                onChange={(values) => {
                  setFilters({ ...filters, [id]: values });
                }}
              />
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
