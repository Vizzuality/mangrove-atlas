import { Cross2Icon } from '@radix-ui/react-icons';
import cx from 'classnames';

import Map from 'components/map';

import LayerManager from './layer-manager';

const DEFAULT_PROPS = {
  id: 'hola',
  initialViewState: {
    longitude: 0,
    latitude: 20,
    zoom: 2,
    pitch: 0,
    bearing: 0,

    // longitude: -122.4,
    // latitude: 37.74,
    // zoom: 11,
    // pitch: 30,
    // bearing: 0,
  },
  minZoom: 2,
  maxZoom: 20,
  mapStyle: 'mapbox://styles/mapbox/light-v11',
  // mapStyle: 'mapbox://styles/afilatore90/cldlfn6r0000601pdppkwocaz',
  // mapStyle: {
  //   version: 8,
  //   name: 'Custom',
  //   sources: {},
  //   layers: [
  //     {
  //       id: 'background',
  //       type: 'background',
  //       paint: {
  //         'background-color': '#000',
  //         'background-opacity': 0,
  //       },
  //     },
  //     {
  //       id: 'custom-layers',
  //       type: 'background',
  //       paint: {
  //         'background-color': '#000',
  //         'background-opacity': 0,
  //       },
  //     },
  //   ],
  // },
};

const MapContainer = () => {
  const mapView = true;
  const isMobile = false;
  const { id, mapStyle, minZoom, maxZoom, initialViewState } = DEFAULT_PROPS;
  return (
    <div className="relative h-screen w-full">
      <Map
        id={id}
        mapStyle={mapStyle}
        // mapStyle=""
        minZoom={minZoom}
        maxZoom={maxZoom}
        initialViewState={initialViewState}
        // viewState={viewState}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        // onMapViewStateChange={handleViewState}
        // onClick={handleClick}
      >
        {() => (
          <>
            <LayerManager />
          </>
        )}
      </Map>
    </div>
  );
};

export default MapContainer;
