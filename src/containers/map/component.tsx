import { useCallback, useMemo } from 'react';

import { ViewState } from 'react-map-gl';
import { useMap } from 'react-map-gl';

import { basemapAtom, URLboundsAtom, locationBoundsAtom } from 'store/map';

import { useRecoilValue } from 'recoil';
import { useRecoilState } from 'recoil';

import BASEMAPS from 'containers/layers/basemaps';
import BasemapSelector from 'containers/map/basemap-selector';
import Legend from 'containers/map/legend';

import Map from 'components/map';
import { CustomMapProps } from 'components/map/types';

import LayerManager from './layer-manager';

export const DEFAULT_PROPS = {
  id: 'default',
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

const MapContainer = () => {
  const basemap = useRecoilValue(basemapAtom);
  const locationBounds = useRecoilValue(locationBoundsAtom);
  const [URLBounds, setURLBounds] = useRecoilState(URLboundsAtom);
  const selectedBasemap = useMemo(() => BASEMAPS.find((b) => b.id === basemap).url, [basemap]);
  const { id, minZoom, maxZoom } = DEFAULT_PROPS;
  const { default: map } = useMap();

  const handleViewState = useCallback(() => {
    if (map) setURLBounds(map.getBounds().toArray());
  }, [map, setURLBounds]);

  const initialViewState: Partial<ViewState> = useMemo(
    () => ({
      ...DEFAULT_PROPS.initialViewState,
      ...(URLBounds && { bounds: URLBounds }),
    }),
    [URLBounds]
  );

  const bounds = useMemo<CustomMapProps['bounds']>(() => {
    if (!locationBounds) return null;
    return {
      bbox: locationBounds,
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
      <div className="absolute bottom-10 right-10">
        <Legend />
        <BasemapSelector />
      </div>
    </div>
  );
};

export default MapContainer;
