import Head from 'next/head';

import LanguageSelector from 'containers/language-selector';
import MapContainer from 'containers/map';
import Sidebar from 'containers/sidebar';
import TranslateScripts from 'containers/translate-scripts';

const Home: React.FC = () => {
  // const MAP_STYLE = useMemo(() => {
  //   return BASEMAPS.find((b) => b.value === basemap)?.url || mapStyle;
  // }, [basemap, mapStyle]);
  return (
    <div className="{cx([styles.printOnly_wrapper])} overflow-hidden">
      <Head>
        <title>Welcome</title>
      </Head>
      <TranslateScripts />
      {/* <Link to={{ type: 'PAGE/APP' }}>
        <img className="{styles.logo}" src={'/logo.svg'} alt="mangrove-atlas" />
      </Link> */}
      {/* {!isMobile && <DesktopLayout />}
      {isMobile && <MobileLayout />}
      {isMobile && <FooterMenu />} */}
      <div
        className="{cx(styles.vis, { [styles.mobileView]:
            mapView && isMobile, })}
          relative"
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
        <MapContainer />
        <Sidebar />
        <LanguageSelector />
      </div>
    </div>
  );
};

export default Home;
