import { useCallback, useMemo } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter } from 'next/router';

import { basemapAtom, URLboundsAtom, locationBoundsAtom } from 'store/map';
import { activeWidgetsAtom } from 'store/widgets';

import { useQueryClient } from '@tanstack/react-query';
import type { LngLatBoundsLike } from 'mapbox-gl';
import { MapboxProps } from 'react-map-gl/dist/esm/mapbox/mapbox';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useRecoilState } from 'recoil';

import BASEMAPS from 'containers/layers/basemaps';
// import BasemapSelector from 'containers/map/basemap-selector';
import LayerManager from 'containers/map/layer-manager';

// import Legend from 'containers/map/legend';
import Collapsible from 'components/collapsible';
import Map from 'components/map';
import { CustomMapProps } from 'components/map/types';

export const DEFAULT_PROPS = {
  id: 'default-mobile',
  initialViewState: {
    longitude: 0,
    latitude: 20,
    zoom: 2,
    pitch: 0,
    bearing: 0,
  },
  minZoom: 2,
  maxZoom: 20,
};

const MapContainerMobile = () => {
  const basemap = useRecoilValue(basemapAtom);
  const locationBounds = useRecoilValue(locationBoundsAtom);
  const [URLBounds, setURLBounds] = useRecoilState(URLboundsAtom);
  const activeWidgets = useRecoilValue(activeWidgetsAtom);
  const setActiveWidgets = useSetRecoilState(activeWidgetsAtom);
  const selectedBasemap = useMemo(() => BASEMAPS.find((b) => b.id === basemap).url, [basemap]);
  const { id, minZoom, maxZoom } = DEFAULT_PROPS;
  const { default: map } = useMap();
  const {
    query: { params },
  } = useRouter();
  const locationId = params?.[1];
  const queryClient = useQueryClient();

  const handleViewState = useCallback(() => {
    if (map) {
      setURLBounds(map.getBounds().toArray());
    }
  }, [map, setURLBounds]);

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
          top: 0,
          right: 0,
          bottom: 0,
          left: 540,
        },
      },
    } satisfies CustomMapProps['bounds'];
  }, [locationBounds]);

  return (
    <div className="absolute top-0 left-0 z-0 h-screen w-screen">
      <Map
        id={id}
        mapStyle={selectedBasemap}
        minZoom={minZoom}
        maxZoom={maxZoom}
        initialViewState={initialViewState}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        onMapViewStateChange={handleViewState}
        bounds={bounds}
      >
        {() => <LayerManager />}
      </Map>
      <div className="absolute top-20 left-0 z-[80]">
        <Collapsible layers={activeWidgets} setActiveWidgets={setActiveWidgets} />
      </div>
    </div>
  );
};

export default MapContainerMobile;
