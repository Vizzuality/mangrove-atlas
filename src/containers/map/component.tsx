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

import { useScreenWidth } from 'hooks/media';

import BASEMAPS from 'containers/layers/basemaps';
import BasemapSelector from 'containers/map/basemap-selector';
import Legend from 'containers/map/legend';

import Collapsible from 'components/collapsible';
import Map from 'components/map';
import Controls from 'components/map/controls';
import FullScreenControl from 'components/map/controls/fullscreen';
import PitchReset from 'components/map/controls/pitch-reset';
import ZoomControl from 'components/map/controls/zoom';
import { CustomMapProps } from 'components/map/types';
import { Media } from 'components/media-query';
import { breakpoints } from 'styles/styles.config';

import LayerManager from './layer-manager';

export const DEFAULT_PROPS = {
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

const MapContainer = ({ id }: { id: string }) => {
  const basemap = useRecoilValue(basemapAtom);
  const locationBounds = useRecoilValue(locationBoundsAtom);
  const [URLBounds, setURLBounds] = useRecoilState(URLboundsAtom);

  const activeWidgets = useRecoilValue(activeWidgetsAtom);
  const setActiveWidgets = useSetRecoilState(activeWidgetsAtom);

  const selectedBasemap = useMemo(() => BASEMAPS.find((b) => b.id === basemap).url, [basemap]);

  const { minZoom, maxZoom } = DEFAULT_PROPS;

  const screenWidth = useScreenWidth();

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
          left: screenWidth >= breakpoints.md ? 540 : 0,
        },
      },
    } satisfies CustomMapProps['bounds'];
  }, [locationBounds, screenWidth]);

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
        {() => (
          <>
            <LayerManager />
            <Controls>
              <FullScreenControl />
              <ZoomControl />
              <PitchReset />
            </Controls>
          </>
        )}
      </Map>
      <Media lessThan="md">
        <div className="absolute top-20 left-0 z-[80]">
          <Collapsible layers={activeWidgets} setActiveWidgets={setActiveWidgets} />
        </div>
      </Media>
      <Media greaterThanOrEqual="md">
        <div className="absolute bottom-10 right-10">
          <Legend />

          <BasemapSelector />
        </div>
      </Media>
    </div>
  );
};

export default MapContainer;
