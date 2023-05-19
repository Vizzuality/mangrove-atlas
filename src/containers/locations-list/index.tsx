import { useCallback, useMemo, useState } from 'react';

import { List, AutoSizer, Style, CellMeasurer, CellMeasurerCache, Parent } from 'react-virtualized';

import { useRouter } from 'next/router';

import { locationBoundsAtom } from 'store/map';

import turfBbox from '@turf/bbox';
import { useRecoilState } from 'recoil';

import { useSearch } from 'hooks/search';

import { useLocations } from 'containers/datasets/locations/hooks';
import { Location } from 'containers/datasets/locations/types';

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
  const [locationBounds, setLocationBounds] = useRecoilState(locationBoundsAtom);
  const { data: locations } = useLocations({ select: ({ data }) => data });
  const searchResults = useSearch(locations, searchValue, ['name', 'iso', 'location_type']);
  const locationsToDisplay = searchValue === '' ? locations : searchResults;
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100,
  });

  const { asPath, replace } = useRouter();

  const handleLocation = useCallback(
    async (location: Location) => {
      const queryParams = asPath.split('?')[1];
      const url = `/${location.location_type}/${
        location.location_type === 'country' ? location.iso : location.location_id
      }?${queryParams}`;

      await replace(url, null);

      if (location.bounds) setLocationBounds(turfBbox(location.bounds) as typeof locationBounds);
    },
    [replace, asPath, setLocationBounds]
  );

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
            <button
              type="button"
              className="flex h-full w-full flex-1 items-end justify-between pb-2"
              onClick={() => {
                handleLocation(locationsToDisplay[index]);
              }}
            >
              <p className="font-sans text-2lg text-black/85">{locationsToDisplay[index].name}</p>
              <span className="text-xs text-grey-800 text-opacity-90">
                {locationNames[locationsToDisplay[index].location_type]}
              </span>
            </button>
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
