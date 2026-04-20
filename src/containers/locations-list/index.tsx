import { useCallback, useState } from 'react';

import { AutoSizer, CellMeasurer, CellMeasurerCache, List, Parent, Style } from 'react-virtualized';

import { useRouter, useSearchParams } from 'next/navigation';

import { trackEvent } from '@/lib/analytics/ga';
import cn from '@/lib/classnames';

import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { locationTypeAtom, locationIdAtom } from '@/store/locations';
import { isNavigatingAtom } from '@/store/map';
import { mapSettingsAtom } from '@/store/map-settings';

import turfBbox from '@turf/bbox';
import { useAtomValue, useSetAtom } from 'jotai';

import { useScreenWidth } from 'hooks/media';
import { useSearch } from 'hooks/search';

import { useLocation, useLocations } from '@/containers/datasets/locations/hooks';
import { Location, LocationTypes } from '@/containers/datasets/locations/types';
import Helper from '@/containers/help/helper';

import Loading from '@/components/ui/loading';
import { breakpoints } from '@/styles/styles.config';

import CLOSE_SVG from '@/svgs/ui/close';

const locationNames = {
  worldwide: 'Worldwide',
  country: 'Country',
  wdpa: 'WDPA',
};

const LocationsList = ({ onSelectLocation }: { onSelectLocation?: () => void }) => {
  const screenWidth = useScreenWidth();
  const [searchValue, setSearchValue] = useState('');

  const locationType = useAtomValue(locationTypeAtom) as LocationTypes;
  const id = useAtomValue(locationIdAtom);
  const {
    data: { id: locationId },
  } = useLocation(id, locationType);

  const setNavigating = useSetAtom(isNavigatingAtom);
  const setMapSettings = useSetAtom(mapSettingsAtom);
  const resetMapSettingsState = () => setMapSettings(false);
  const setDrawingUploadToolState = useSetAtom(drawingUploadToolAtom);
  const setDrawingToolState = useSetAtom(drawingToolAtom);

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

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLocation = useCallback(
    (location: Location) => {
      const locationId =
        location.location_type === 'worldwide'
          ? ''
          : location.location_type === 'country'
            ? location.iso
            : location.location_id;

      // Replace bounds with the new location's geometry bounds; keep all other params.
      const bbox = location.bounds
        ? (turfBbox(location.bounds) as [number, number, number, number])
        : null;
      const params = new URLSearchParams(searchParams.toString());
      if (bbox) {
        params.set(
          'bounds',
          JSON.stringify([
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]],
          ])
        );
      } else {
        params.delete('bounds');
      }
      const queryParams = params.toString();

      const url =
        location.location_type === 'worldwide'
          ? `/?${queryParams}`
          : `/${location.location_type}/${locationId}?${queryParams}`;

      setNavigating(true);
      router.replace(url);

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
      router,
      searchParams,
      setNavigating,
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
                'hover:bg-brand-800/10 flex h-full w-full flex-1 items-center justify-between px-4 py-1 hover:rounded-2xl':
                  true,
                'print:hidden': screenWidth >= breakpoints.lg,
                'pointer-events-none': locationId === locationsToDisplay[index].id,
              })}
              onClick={() => {
                // Google Analytics tracking
                trackEvent('Select location', {
                  category: 'Menu - Location selection',
                  action: 'Select location',
                  label: `Select location - ${locationsToDisplay[index].name}`,
                  value: locationsToDisplay[index].name,
                });
                handleLocation(locationsToDisplay[index]);
              }}
            >
              <p
                className={cn({
                  'text-2lg text-left font-sans font-light text-black/85': true,
                  'text-brand-800 font-semibold': locationId === locationsToDisplay[index].id,
                })}
              >
                {locationsToDisplay[index].name}
              </p>
              <span className="text-grey-800 text-opacity-90 text-xs">
                {locationNames[locationsToDisplay[index].location_type]}
              </span>
            </button>
          </div>
        )}
      </CellMeasurer>
    );
  };

  return (
    <div className="space-y-4 overflow-hidden pt-8 after:bg-linear-to-b after:from-white/20 after:to-white after:content-[''] md:pt-0">
      <div className="relative box-border w-full px-1 pt-0.5">
        <Helper
          className={{
            button: '-top-1 right-4 z-20',
            tooltip: 'w-fit-content max-w-[400px]',
          }}
          tooltipPosition={{ top: -0, left: -5 }}
          message="Click this icon to search for a country or a protected area. Countries can also be selected by clicking on the map or on the selected geography seen in the blue space above. "
        >
          <input
            type="search"
            className="caret-brand-800 focus:border-grey-75 relative box-border w-full border-2 border-transparent bg-transparent text-3xl text-black/85 opacity-50 focus:rounded focus:border-b-2 focus:ring-transparent focus:outline-none"
            placeholder="Type name..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.currentTarget.value)}
          />
        </Helper>
        {searchValue && (
          <button
            type="button"
            className="absolute top-1/2 right-6 flex -translate-y-1/2 items-center"
            onClick={() => setSearchValue('')}
          >
            <CLOSE_SVG
              className="h-5 w-5 transform fill-current opacity-50"
              role="img"
              aria-hidden={true}
            />
          </button>
        )}
      </div>

      {(isFetching || isLoading) && <Loading visible iconClassName="flex w-10 h-10 m-auto my-10" />}
      <div className="relative max-h-7 min-h-screen">
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
