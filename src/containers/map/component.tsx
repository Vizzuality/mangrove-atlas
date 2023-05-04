import { useCallback, useMemo } from 'react';

import { ViewState } from 'react-map-gl';

import { basemapAtom, mapAtom } from 'store/map';

import { useRecoilValue } from 'recoil';
import { useRecoilState } from 'recoil';

import BASEMAPS from 'containers/layers/basemaps';
import BasemapSelector from 'containers/map/basemap-selector';
import Legend from 'containers/map/legend';

import Map from 'components/map';

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
  const [mapSettings, setMapSettings] = useRecoilState(mapAtom);
  const selectedBasemap = useMemo(() => BASEMAPS.find((b) => b.id === basemap).url, [basemap]);
  const mapView = true;
  const isMobile = false;
  const { id, minZoom, maxZoom } = DEFAULT_PROPS;
  const handleClick = useCallback((e) => console.log(e), []);

  const handleViewState = useCallback(
    ({ latitude, longitude, zoom }: ViewState) => {
      setMapSettings({
        latitude,
        longitude,
        zoom,
      });
    },
    [setMapSettings]
  );

  const initialViewState: Partial<ViewState> = useMemo(
    () => ({
      ...DEFAULT_PROPS.initialViewState,
      ...mapSettings,
    }),
    [mapSettings]
  );

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
        onClick={handleClick}
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
