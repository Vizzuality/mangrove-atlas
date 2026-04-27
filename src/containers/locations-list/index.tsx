import { useCallback, useRef, useState } from 'react';

import { AutoSizer, CellMeasurer, CellMeasurerCache, List, Parent, Style } from 'react-virtualized';

import { trackEvent } from '@/lib/analytics/ga';
import cn from '@/lib/classnames';

import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { mapSettingsAtom } from '@/store/map-settings';

import { useSetAtom } from 'jotai';

import { useLocationNavigation } from 'hooks/location-navigation';
import { useScreenWidth } from 'hooks/media';
import { useSearch } from 'hooks/search';
import { useSyncLocation } from 'hooks/use-sync-location';

import { useLocation, useLocations } from '@/containers/datasets/locations/hooks';
import { Location } from '@/containers/datasets/locations/types';
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
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const listRef = useRef<List>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const { type: locationType, id } = useSyncLocation();
  const {
    data: { id: locationId },
  } = useLocation(id, locationType);

  const setMapSettings = useSetAtom(mapSettingsAtom);
  const setDrawingUploadToolState = useSetAtom(drawingUploadToolAtom);
  const setDrawingToolState = useSetAtom(drawingToolAtom);
  const { navigateToLocation } = useLocationNavigation();

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

  const handleLocation = useCallback(
    (location: Location) => {
      navigateToLocation(location);

      setDrawingUploadToolState((drawingUploadToolState) => ({
        ...drawingUploadToolState,
        enabled: false,
      }));

      setDrawingToolState((drawingToolState) => ({
        ...drawingToolState,
        enabled: false,
      }));

      if (onSelectLocation) onSelectLocation();
      setMapSettings(false);
    },
    [
      navigateToLocation,
      onSelectLocation,
      setMapSettings,
      setDrawingToolState,
      setDrawingUploadToolState,
    ]
  );

  const handleListKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const count = locationsToDisplay?.length ?? 0;
      if (count === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => (prev < count - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setFocusedIndex(count - 1);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < count) {
            handleLocation(locationsToDisplay[focusedIndex]);
          }
          break;
      }
    },
    [locationsToDisplay, focusedIndex, handleLocation]
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
              role="option"
              id={`location-option-${locationsToDisplay[index].id}`}
              aria-selected={locationId === locationsToDisplay[index].id}
              aria-disabled={locationId === locationsToDisplay[index].id || undefined}
              tabIndex={-1}
              className={cn({
                'hover:bg-brand-800/10 flex h-full w-full flex-1 items-center justify-between px-4 py-1 hover:rounded-2xl':
                  true,
                'pointer-events-none': locationId === locationsToDisplay[index].id,
                'bg-brand-800/5 border-brand-800 rounded-2xl border-2': focusedIndex === index,
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
            tooltip: 'w-fit-content max-w-100',
          }}
          tooltipPosition={{ top: -0, left: -5 }}
          message="Click this icon to search for a country or a protected area. Countries can also be selected by clicking on the map or on the selected geography seen in the blue space above. "
        >
          <input
            type="search"
            aria-label="Search locations"
            className="caret-brand-800 focus:border-grey-75 relative box-border w-full border-2 border-transparent bg-transparent text-3xl text-black/85 opacity-50 focus:rounded focus:border-b-2 focus:ring-transparent focus:outline-none"
            placeholder="Type name..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.currentTarget.value);
              setFocusedIndex(-1);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex(0);
                listboxRef.current?.focus();
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const count = locationsToDisplay?.length ?? 0;
                if (count > 0) {
                  setFocusedIndex(count - 1);
                  listboxRef.current?.focus();
                }
              }
            }}
          />
        </Helper>
        {searchValue && (
          <button
            type="button"
            aria-label="Clear search"
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

      <div role="status" aria-live="polite" className="sr-only">
        {searchValue && locationsToDisplay
          ? `${locationsToDisplay.length} location${locationsToDisplay.length === 1 ? '' : 's'} found`
          : ''}
      </div>

      {(isFetching || isLoading) && <Loading visible iconClassName="flex w-10 h-10 m-auto my-10" />}
      <div className="relative max-h-7 min-h-screen px-1">
        {isFetched && !isLoading && !isFetching && (
          <AutoSizer>
            {({ width, height }) => (
              <div
                ref={listboxRef}
                role="listbox"
                aria-label="Locations"
                tabIndex={0}
                aria-activedescendant={
                  focusedIndex >= 0 && locationsToDisplay[focusedIndex]
                    ? `location-option-${locationsToDisplay[focusedIndex].id}`
                    : undefined
                }
                onKeyDown={handleListKeyDown}
                onFocus={() => {
                  if (focusedIndex < 0) setFocusedIndex(0);
                }}
                className="focus:outline-none"
                style={{ width, height }}
              >
                <List
                  ref={listRef}
                  role="presentation"
                  containerRole="presentation"
                  tabIndex={-1}
                  width={width}
                  height={height}
                  deferredMeasurementCache={cache}
                  rowHeight={cache.rowHeight}
                  rowRenderer={renderRow}
                  rowCount={locationsToDisplay.length}
                  overscanRowCount={15}
                  scrollToIndex={focusedIndex >= 0 ? focusedIndex : undefined}
                  className="no-scrollbar"
                />
              </div>
            )}
          </AutoSizer>
        )}
      </div>
    </div>
  );
};

export default LocationsList;
