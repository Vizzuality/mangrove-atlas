import Head from 'next/head';

import type { GetServerSideProps } from 'next';

import MapContainer from 'containers/map';
import Sidebar from 'containers/sidebar';
import WidgetsContainer from 'containers/widgets';

// ! this layout is replicated in pages/index.tsx, move it later somehwere else to share it
const Home: React.FC = () => {
  // const MAP_STYLE = useMemo(() => {
  //   return BASEMAPS.find((b) => b.value === basemap)?.url || mapStyle;
  // }, [basemap, mapStyle]);

  return (
    <div className="{cx([styles.printOnly_wrapper])}">
      <Head>
        <title>Global Mangrove Watch</title>
      </Head>
      {/* <Link to={{ type: 'PAGE/APP' }}>
        <img className="{styles.logo}" src={'/logo.svg'} alt="mangrove-atlas" />
      </Link> */}
      {/* {!isMobile && <DesktopLayout />}
      {isMobile && <MobileLayout />}
      {isMobile && <FooterMenu />} */}
      <div className="relative h-screen w-screen">
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
        <MapContainer />
        <Sidebar />
        <WidgetsContainer />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Home;
