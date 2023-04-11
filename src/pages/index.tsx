import Head from 'next/head';

import { Cross2Icon } from '@radix-ui/react-icons';
import { PlusIcon } from '@radix-ui/react-icons';

import MapContainer from 'containers/map';

import CollapsibleDemo from 'components/collapsible';
import Map from 'components/map';

const DEFAULT_PROPS = {
  id: 'default',
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

const LAYERS = [
  { id: 'mangrove-coverage', label: 'Mangrove Coverage' },
  { id: 'mangrove-mass', label: 'Mangrove Mass' },
  { id: 'habitat-change', label: 'Mangrove Habitat Change' },
];

const Home: React.FC = () => {
  // const MAP_STYLE = useMemo(() => {
  //   return BASEMAPS.find((b) => b.value === basemap)?.url || mapStyle;
  // }, [basemap, mapStyle]);

  return (
    <div className="{cx([styles.printOnly_wrapper])}">
      <Head>
        <title>Welcome</title>
      </Head>
      {/* <Link to={{ type: 'PAGE/APP' }}>
        <img className="{styles.logo}" src={'/logo.svg'} alt="mangrove-atlas" />
      </Link> */}
      {/* {!isMobile && <DesktopLayout />}
      {isMobile && <MobileLayout />}
      {isMobile && <FooterMenu />} */}

      <div
        className="{cx(styles.vis, {
            [styles.mobileView]: mapView && isMobile,
          })}"
      >
        {/* <h1
          className="{cx(styles.printOnly, {
              [styles._short]: location?.name.length < 10,
              [styles._medium]: location?.name.length > 10,
            })}"
        >
           {location?.name}
          Worldwide
        </h1> */}

        {/* <p className="{styles.printOnly}">
            Powered by Global Mangrove Watch. https://www.globalmangrovewatch.org
          </p> */}
        <div className="absolute top-0 z-10">
          <CollapsibleDemo layers={LAYERS} />
        </div>
        <MapContainer />
      </div>
    </div>
  );
};

export default Home;
