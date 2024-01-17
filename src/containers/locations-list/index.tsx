import { useCallback, useState } from 'react';

import { List, AutoSizer, Style, CellMeasurer, CellMeasurerCache, Parent } from 'react-virtualized';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';
import { locationBoundsAtom } from 'store/map';
import { mapSettingsAtom } from 'store/map-settings';

import turfBbox from '@turf/bbox';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';

import { useScreenWidth } from 'hooks/media';
import { useSearch } from 'hooks/search';

import { useLocations } from 'containers/datasets/locations/hooks';
import { Location } from 'containers/datasets/locations/types';
import HighlightedPlacesMobile from 'containers/locations-list/mobile/highlighted-places';

import HighlightedPlaces from 'components/highlighted-places';
import Icon from 'components/icon';
import { Media } from 'components/media-query';
import { breakpoints } from 'styles/styles.config';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite';

const locationNames = {
  worldwide: 'Worldwide',
  country: 'Country',
  wdpa: 'WDPA',
};

const LocationsList = ({ onSelectLocation }: { onSelectLocation?: () => void }) => {
  const screenWidth = useScreenWidth();
  const [searchValue, setSearchValue] = useState('');
  const [locationBounds, setLocationBounds] = useRecoilState(locationBoundsAtom);
  const resetMapSettingsState = useResetRecoilState(mapSettingsAtom);
  const setDrawingUploadToolState = useSetRecoilState(drawingUploadToolAtom);
  const setDrawingToolState = useSetRecoilState(drawingToolAtom);

  const { data: locations } = useLocations({ select: ({ data }) => data });
  const searchResults = useSearch(locations, searchValue, ['name', 'iso', 'location_type']);
  const locationsToDisplay = searchValue === '' ? locations : searchResults;
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100,
  });

  const { asPath, replace } = useRouter();

  const handleLocation = useCallback(
    (location: Location) => {
      const queryParams = asPath.split('?')[1];

      const locationType = location.location_type === 'worldwide' ? '/' : location.location_type;
      const locationId =
        location.location_type === 'worldwide'
          ? ''
          : location.location_type === 'country'
          ? location.iso
          : location.location_id;
      const url = `/${locationType}/${locationId}?${queryParams !== undefined ? queryParams : ''}`;

      replace(url, null);

      if (location.bounds) setLocationBounds(turfBbox(location.bounds) as typeof locationBounds);

      setDrawingUploadToolState((drawingUploadToolState) => ({
        ...drawingUploadToolState,
        enabled: false,
      }));

      setDrawingToolState((drawingToolState) => ({
        ...drawingToolState,
        enabled: false,
      }));

      onSelectLocation();
      if (onSelectLocation) onSelectLocation();
      resetMapSettingsState();
    },
    [replace, asPath, setLocationBounds, onSelectLocation]
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
              className={cn({
                'flex h-full w-full flex-1 items-center justify-between px-4 py-1 hover:rounded-2xl hover:bg-brand-800 hover:bg-opacity-10':
                  true,
                'print:hidden': screenWidth >= breakpoints.lg,
              })}
              onClick={() => {
                handleLocation(locationsToDisplay[index]);
              }}
            >
              <p className="text-left font-sans text-2lg font-light text-black/85">
                {locationsToDisplay[index].name}
              </p>
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
    <div className="space-y-4 overflow-hidden pt-8 after:bg-gradient-to-b after:from-white/20 after:to-white/100 after:content-[''] md:pt-0">
      <div className="relative box-border w-full px-1 pt-0.5">
        <input
          type="search"
          className="relative box-border w-full border-2 border-transparent bg-transparent text-3xl text-black/85 caret-brand-800 opacity-50 focus:rounded focus:border-b-2 focus:border-grey-75 focus:outline-none focus:ring-transparent"
          placeholder="Type name..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
        />
        {searchValue && (
          <button
            type="button"
            className="absolute top-1/2 right-6 flex -translate-y-1/2 items-center"
            onClick={() => setSearchValue('')}
          >
            <Icon icon={CLOSE_SVG} className="h-5 w-5 transform opacity-50" />
          </button>
        )}
      </div>

      <Media lessThan="md">
        <HighlightedPlacesMobile />
      </Media>
      <Media greaterThanOrEqual="md">
        <HighlightedPlaces onSelectLocation={onSelectLocation} />
      </Media>
      <div className="relative min-h-[50vh]">
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
              className="no-scrollbar"
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

export default LocationsList;
