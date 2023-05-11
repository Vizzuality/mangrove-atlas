import { useState } from 'react';

import { List, AutoSizer, Style, CellMeasurer, CellMeasurerCache, Parent } from 'react-virtualized';

import Link from 'next/link';

import { useSearch } from 'hooks/search';

import { useLocations } from 'containers/datasets/locations/hooks';

import HighlightedPlaces from 'components/highlighted-places';
import Icon from 'components/icon';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite';

const locationNames = {
  worldwide: 'Worldwide',
  country: 'Country',
  wdpa: 'WDPA',
};

const LocationsList = () => {
  const [searchValue, setSearchValue] = useState('');
  const { data: locations } = useLocations();
  const searchResults = useSearch(locations, searchValue, ['name', 'iso', 'location_type']);
  const locationsToDisplay = searchValue === '' ? locations : searchResults;
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100,
  });

  const renderRow = ({
    index,
    key,
    style,
    parent,
  }: {
    index: number;
    key: string;
    style: Style;
    parent: Parent;
  }) => {
    return (
      <CellMeasurer key={key} parent={parent} cache={cache} columnIndex={0} rowIndex={index}>
        {({ registerChild }) => (
          <div style={style} ref={registerChild}>
            <Link
              className="flex h-full w-full flex-1 items-end justify-between pb-2"
              href={`/${locationsToDisplay[index].location_type}/${
                locationsToDisplay[index].location_type === 'country'
                  ? locationsToDisplay[index].iso
                  : locationsToDisplay[index].location_id
              }`}
            >
              <p className="font-sans text-2lg text-black/85">{locationsToDisplay[index].name}</p>
              <span className="text-xs text-grey-800 text-opacity-90">
                {locationNames[locationsToDisplay[index].location_type]}
              </span>
            </Link>
          </div>
        )}
      </CellMeasurer>
    );
  };

  return (
    <div className="no-scrollbar space-y-4 overflow-hidden after:bg-gradient-to-b after:from-white/20 after:to-white/100 after:content-['']">
      <div className="relative">
        <input
          type="search"
          className="w-full flex-1 border-none bg-transparent text-3xl text-black/85 opacity-50"
          placeholder="Type name..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
        />
        {searchValue && (
          <button
            type="button"
            className="absolute top-1/2 right-0 flex -translate-y-1/2 items-center"
            onClick={() => setSearchValue('')}
          >
            <Icon icon={CLOSE_SVG} className="h-5 w-5  transform opacity-50" />
          </button>
        )}
      </div>

      <HighlightedPlaces />
      <div className="relative h-full">
        <AutoSizer>
          {({ width, height }) => (
            <List
              width={width}
              height={height}
              deferredMeasurementCache={cache}
              rowHeight={cache.rowHeight}
              rowRenderer={renderRow}
              rowCount={locationsToDisplay.length}
              overscanRowCount={15}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

export default LocationsList;
