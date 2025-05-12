import { useCallback, useState } from 'react';

import { AutoSizer, CellMeasurer, CellMeasurerCache, List, Parent, Style } from 'react-virtualized';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';
import { locationBoundsAtom } from 'store/map';
import { mapSettingsAtom } from 'store/map-settings';

import turfBbox from '@turf/bbox';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';

import { useScreenWidth } from 'hooks/media';
import { useSearch } from 'hooks/search';

import { useLocation, useLocations } from 'containers/datasets/locations/hooks';
import { Location, LocationTypes } from 'containers/datasets/locations/types';

import Icon from 'components/ui/icon';
import Loading from 'components/ui/loading';
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

  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { id: locationId },
  } = useLocation(id, locationType);

  const [locationBounds, setLocationBounds] = useRecoilState(locationBoundsAtom);
  const resetMapSettingsState = useResetRecoilState(mapSettingsAtom);
  const setDrawingUploadToolState = useSetRecoilState(drawingUploadToolAtom);
  const setDrawingToolState = useSetRecoilState(drawingToolAtom);

  const {
    data: locations,
    isFetching,
    isLoading,
    isFetched,
  } = useLocations({ select: ({ data }) => data });
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
    [
      replace,
      asPath,
      setLocationBounds,
      onSelectLocation,
      resetMapSettingsState,
      setDrawingToolState,
      setDrawingUploadToolState,
    ]
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
                'pointer-events-none': locationId === locationsToDisplay[index].id,
              })}
              onClick={() => {
                handleLocation(locationsToDisplay[index]);
              }}
            >
              <p
                className={cn({
                  'text-left font-sans text-2lg font-light text-black/85': true,
                  'font-semibold text-brand-800': locationId === locationsToDisplay[index].id,
                })}
              >
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

      {(isFetching || isLoading) && <Loading visible iconClassName="flex w-10 h-10 m-auto my-10" />}
      <div className="relative max-h-7 min-h-[100vh]">
        {isFetched && !isLoading && !isFetching && (
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
        )}
      </div>
    </div>
  );
};

export default LocationsList;
