import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Map, useMap, type MapProps } from 'react-map-gl';

import { locationBoundsAtom, mapCursorAtom, useSyncBasemap, useSyncURLBounds } from '@/store/map';

import { useQueryClient } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';
import type { LngLatBoundsLike } from 'mapbox-gl';

import { useScreenWidth } from 'hooks/media';
import { useSyncLocation } from 'hooks/use-sync-location';

import BASEMAPS from '@/containers/datasets/contextual-layers/basemaps';
import LayerManager from '@/containers/map/layer-manager';
import Legend from '@/containers/map/legend';

import { breakpoints } from '@/styles/styles.config';

const DEFAULT_PROPS = {
  initialViewState: {
    longitude: 0,
    latitude: 20,
    zoom: 2,
    pitch: 0,
    bearing: 0,
  },
  minZoom: 1,
  maxZoom: 20,
};

const EmbeddedMap = ({ mapId }: { mapId: string }) => {
  const containerRef = useRef(null);

  const [basemap] = useSyncBasemap();

  const [locationBounds, setLocationBounds] = useAtom(locationBoundsAtom);
  const [URLBounds, setURLBounds] = useSyncURLBounds();
  const cursor = useAtomValue(mapCursorAtom);

  const selectedBasemap = useMemo(() => BASEMAPS.find((b) => b.id === basemap)?.url, [basemap]);

  const { minZoom, maxZoom } = DEFAULT_PROPS;

  const screenWidth = useScreenWidth();

  const { [mapId]: map } = useMap();

  const { id: locationId } = useSyncLocation();
  const queryClient = useQueryClient();

  const handleMoveEnd = useCallback<NonNullable<MapProps['onMoveEnd']>>(
    (e) => {
      if (!e.originalEvent) return;
      if (map) setURLBounds(map.getBounds().toArray());
    },
    [map, setURLBounds]
  );

  const [loaded, setLoaded] = useState(false);
  const handleMapLoad = useCallback(() => setLoaded(true), []);

  const initialViewState = useMemo(
    () => {
      const bounds =
        (URLBounds as number[][] | null) ??
        (locationId ? (queryClient.getQueryData<number[][]>(['location-bounds']) ?? null) : null);
      if (bounds) {
        return {
          ...DEFAULT_PROPS.initialViewState,
          bounds: bounds as LngLatBoundsLike,
          fitBoundsOptions: { padding: { top: 50, bottom: 50, left: 50, right: 50 } },
        };
      }
      return DEFAULT_PROPS.initialViewState;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Programmatic fitBounds
  const lastFitBoundsRef = useRef<string | null>(null);
  useEffect(() => {
    if (!map || !locationBounds) return;
    const key = locationBounds.join(',');
    if (lastFitBoundsRef.current === key) return;
    lastFitBoundsRef.current = key;
    map.fitBounds(
      [
        [locationBounds[0], locationBounds[1]],
        [locationBounds[2], locationBounds[3]],
      ],
      {
        padding: {
          top: 50,
          right: 20,
          bottom: 50,
          left: screenWidth >= breakpoints.lg ? 620 + 20 : 20,
        },
      }
    );
  }, [map, locationBounds, screenWidth]);

  return (
    <div
      className="print:page-break-after print:page-break-inside-avoid absolute top-0 left-0 z-0 h-screen w-screen print:relative print:h-[90vh] print:w-screen"
      ref={containerRef}
    >
      <Map
        id={mapId}
        reuseMaps
        mapStyle={selectedBasemap}
        minZoom={minZoom}
        maxZoom={maxZoom}
        initialViewState={initialViewState}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        onMoveEnd={handleMoveEnd}
        onLoad={handleMapLoad}
        interactiveLayerIds={[]}
        cursor={cursor}
        preserveDrawingBuffer
        testMode={typeof navigator !== 'undefined' && navigator.webdriver === true}
      >
        {loaded && <LayerManager />}
      </Map>
      <div className="absolute right-6 bottom-11 z-50 mr-0.5">
        <Legend embedded />
      </div>
    </div>
  );
};

export default EmbeddedMap;
