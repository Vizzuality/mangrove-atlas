import cn from 'lib/classnames';

import Icon from 'components/icon';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite';

import { BUTTON_STYLES } from '../widget';

type SelectedFiltersProps = {
  filters: { [key: string]: string[] | number[] };
  filtersSelected: string[];
  handleRemoveFilter: (filter: string, value: string) => void;
};
const SelectedFilters = ({
  filters,
  filtersSelected,
  handleRemoveFilter,
}: SelectedFiltersProps) => {
  return (
    <div className="space-y-2">
      {filtersSelected.map((filter, i) => (
        <div key={`${filter}-${i}`} className="flex space-x-2">
          {filters[filter].map((value) => (
            <button
              key={value}
              type="button"
              className={cn({
                [BUTTON_STYLES]: true,
                'flex  items-center space-x-2 overflow-hidden text-ellipsis whitespace-nowrap bg-[#00857f26] text-sm text-black/85':
                  true,
              })}
            >
              <button type="button" onClick={() => handleRemoveFilter(filter, value)}>
                <Icon icon={CLOSE_SVG} className="mr-1 h-3 w-3" />
              </button>

              <p className="whitespace overflow-hidden text-ellipsis">{value}</p>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SelectedFilters;
