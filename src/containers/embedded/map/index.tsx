import { useEffect, useMemo, useRef } from 'react';

import { useMap } from 'react-map-gl';

import { locationIdAtom } from '@/store/locations';
import { locationBoundsAtom, mapCursorAtom, useSyncBasemap, useSyncURLBounds } from '@/store/map';

import { useQueryClient } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';
import { useDebouncedCallback } from 'use-debounce';

import { useScreenWidth } from 'hooks/media';

import BASEMAPS from '@/containers/datasets/contextual-layers/basemaps';
import LayerManager from '@/containers/map/layer-manager';
import Legend from '@/containers/map/legend';

import Map from '@/components/map';
import { breakpoints } from '@/styles/styles.config';

export const DEFAULT_PROPS = {
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

  const locationId = useAtomValue(locationIdAtom);
  const queryClient = useQueryClient();

  const handleMapMove = useDebouncedCallback(() => {
    if (map) {
      setURLBounds(map.getBounds().toArray());
    }
  }, 500);

  const defaultBbox = useMemo<number[][] | null>(() => {
    if (URLBounds) return URLBounds as number[][];
    if (locationId) {
      return queryClient.getQueryData<number[][]>(['location-bounds']) ?? null;
    }
    return null;
  }, [URLBounds, locationId, queryClient]);

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
        initialViewState={DEFAULT_PROPS.initialViewState}
        defaultBbox={defaultBbox}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        onMapMove={handleMapMove}
        interactiveLayerIds={[]}
        cursor={cursor}
        preserveDrawingBuffer
      >
        {() => <LayerManager />}
      </Map>
      <div className="absolute right-6 bottom-11 z-50 mr-0.5">
        <Legend embedded />
      </div>
    </div>
  );
};

export default EmbeddedMap;
