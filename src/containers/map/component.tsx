import { useMemo } from 'react';

import { basemap } from 'store/map';

import { useRecoilValue } from 'recoil';

import BASEMAPS from 'containers/layers/basemaps';
import BasemapSelector from 'containers/map/basemap-selector';

import Map from 'components/map';

import LayerManager from './layer-manager';

const DEFAULT_PROPS = {
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
  const bm = useRecoilValue(basemap);
  const selectedBasemap = useMemo(() => BASEMAPS.find((basemap) => basemap.id === bm).url, [bm]);
  const mapView = true;
  const isMobile = false;
  const { id, minZoom, maxZoom, initialViewState } = DEFAULT_PROPS;
  return (
    <div className="relative h-screen w-full">
      <Map
        id={id}
        mapStyle={selectedBasemap}
        minZoom={minZoom}
        maxZoom={maxZoom}
        initialViewState={initialViewState}
        // viewState={viewState}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        // onMapViewStateChange={handleViewState}
        // onClick={handleClick}
      >
        {() => <LayerManager />}
      </Map>
      <div className="absolute bottom-10 right-10">
        <BasemapSelector />
      </div>
    </div>
  );
};

export default MapContainer;
