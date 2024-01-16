import { useCallback, useMemo, useRef, useState } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter } from 'next/router';

import { basemapAtom, URLboundsAtom, locationBoundsAtom, mapCursorAtom } from 'store/map';

import { useQueryClient } from '@tanstack/react-query';
import type { LngLatBoundsLike } from 'mapbox-gl';
import { MapboxProps } from 'react-map-gl/dist/esm/mapbox/mapbox';
import { useRecoilValue, useRecoilState } from 'recoil';

import { useScreenWidth } from 'hooks/media';

import BASEMAPS from 'containers/datasets/contextual-layers/basemaps';
import LayerManager from 'containers/map/layer-manager';
import Legend from 'containers/map/legend';

import Map from 'components/map';
import { CustomMapProps } from 'components/map/types';
import { breakpoints } from 'styles/styles.config';

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
  const mapRef = useRef(null);
  const [, setLoaded] = useState(false);

  const basemap = useRecoilValue(basemapAtom);

  const [locationBounds, setLocationBounds] = useRecoilState(locationBoundsAtom);
  const [URLBounds, setURLBounds] = useRecoilState(URLboundsAtom);
  const cursor = useRecoilValue(mapCursorAtom);

  const selectedBasemap = useMemo(() => BASEMAPS.find((b) => b.id === basemap).url, [basemap]);

  const { minZoom, maxZoom } = DEFAULT_PROPS;

  const screenWidth = useScreenWidth();

  const { [mapId]: map } = useMap();

  const {
    query: { params },
  } = useRouter();
  const locationId = params?.[1];
  const queryClient = useQueryClient();

  const handleViewState = useCallback(() => {
    if (map) {
      setURLBounds(map.getBounds().toArray());
      setLocationBounds(null);
    }
  }, [map, setURLBounds, setLocationBounds]);

  const initialViewState: MapboxProps['initialViewState'] = useMemo(
    () => ({
      ...DEFAULT_PROPS.initialViewState,
      ...(URLBounds && { bounds: URLBounds as LngLatBoundsLike }),
      ...(!URLBounds &&
        locationId && {
          bounds: queryClient.getQueryData<typeof locationBounds>(['location-bounds']) || null,
        }),
    }),
    [URLBounds, locationId, queryClient]
  );

  const bounds = useMemo<CustomMapProps['bounds']>(() => {
    if (!locationBounds) return null;

    return {
      bbox: locationBounds,
      options: {
        padding: {
          top: 50,
          right: 20,
          bottom: 50,
          left: screenWidth >= breakpoints.lg ? 620 + 20 : 20,
        },
      },
    } satisfies CustomMapProps['bounds'];
  }, [locationBounds, screenWidth]);

  const handleMapLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <div
      className="print:page-break-after print:page-break-inside-avoid absolute top-0 left-0 z-0 h-screen w-screen print:relative print:h-[90vh] print:w-screen"
      ref={mapRef}
    >
      <Map
        id={mapId}
        reuseMaps
        mapStyle={selectedBasemap}
        minZoom={minZoom}
        maxZoom={maxZoom}
        initialViewState={initialViewState}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        onMapViewStateChange={handleViewState}
        bounds={bounds}
        interactiveLayerIds={[]}
        onClick={null}
        onMouseMove={null}
        onLoad={handleMapLoad}
        cursor={cursor}
        preserveDrawingBuffer
      >
        {() => <LayerManager />}
      </Map>
      <div className="absolute bottom-11 right-7 z-50 mr-0.5">
        <Legend embedded />
      </div>
    </div>
  );
};

export default EmbeddedMap;
