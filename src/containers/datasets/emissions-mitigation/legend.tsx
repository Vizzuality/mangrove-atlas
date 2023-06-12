import orderBy from 'lodash-es/orderBy';

import cn from 'lib/classnames';

type Item = {
  color: string;
  label: string;
};

type LegendTypes = {
  items: Item[];
  onClick: (
    label: string,
    filteredIndicators: string[],
    setFilteredIndicators: (filteredIndicators: string[]) => void
  ) => void;
  filteredIndicators: string[];
  setFilteredIndicators: (filteredIndicators: string[]) => void;
};

const Legend = ({ items, onClick, filteredIndicators, setFilteredIndicators }: LegendTypes) => {
  const sortedItems = orderBy(items, ['category', 'order'], ['asc', 'desc']);
  return (
    <div className="ml-6 flex w-full max-w-[40%] flex-col text-black/85">
      {sortedItems.map(({ color, label }) => (
        <button
          type="button"
          key={label}
          className={cn({
            'flex items-start justify-start text-sm': true,
            'opacity-50': !filteredIndicators.includes(label) && !!filteredIndicators.length,
          })}
          onClick={() => onClick(label, filteredIndicators, setFilteredIndicators)}
        >
          <span
            style={{ backgroundColor: color }}
            className="mt-1.5 mr-2.5 flex h-3 w-1.5 shrink-0 rounded-md"
          />
          <p className="text-start">{label}</p>
        </button>
      ))}
    </div>
  );
};

export default Legend;
