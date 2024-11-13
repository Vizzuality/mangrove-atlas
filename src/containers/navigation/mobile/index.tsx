import ConfigureWidgets from 'containers/navigation/mobile/configure';
import LanguageSelector from 'containers/navigation/mobile/language-selector';
import Locations from 'containers/navigation/mobile/locations';
import MapToggle from 'containers/navigation/mobile/map-toggle';
import News from 'containers/navigation/mobile/news';

const NavigationMobile = () => {
  return (
    <div className="fixed -bottom-0.5 z-50 h-36 w-screen bg-[url('/images/mobile-sidebar-bg.svg')] bg-cover bg-no-repeat">
      <div className="max-w-screen mt-20 flex h-24 items-center justify-center space-x-6">
        <Locations />
        <News />
        <ConfigureWidgets />
        {/* <LanguageSelector /> */}
        <MapToggle />
      </div>
    </div>
  );
};

export default NavigationMobile;
