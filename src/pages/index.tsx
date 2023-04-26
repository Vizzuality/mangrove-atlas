import Head from 'next/head';
import Script from 'next/script';

import LanguageSelector from 'containers/language-selector';
import MapContainer from 'containers/map';
import Sidebar from 'containers/sidebar';

const Home: React.FC = () => {
  // const MAP_STYLE = useMemo(() => {
  //   return BASEMAPS.find((b) => b.value === basemap)?.url || mapStyle;
  // }, [basemap, mapStyle]);
  return (
    <div className="{cx([styles.printOnly_wrapper])}">
      <Head>
        <title>Welcome</title>
      </Head>
      <Script id="transifex">
        {`
        window.liveSettings = {
          api_key: "4de8143614ca4c0e94c872e31e771e37",
          detectlang: true,
          autocollect: true,
          dynamic: true,
          manual_init: false,
          translate_urls: false
        }`}
      </Script>
      <Script id="transifex-live" src="//cdn.transifex.com/live.js" />
      <Script id="transifex-load" strategy="lazyOnload">
        {`
          Transifex.live.onFetchLanguages(function (languages) {
            Transifex.live.onTranslatePage(function (language_code) {
              console.log(language_code);
            });
          })
        `}
      </Script>
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
