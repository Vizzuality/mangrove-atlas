import ConfigureWidgets from '@/containers/navigation/mobile/configure';
import LanguageSelector from '@/containers/navigation/mobile/language-selector';
import Locations from '@/containers/navigation/mobile/locations';
import MapToggle from '@/containers/navigation/mobile/map-toggle';
import News from '@/containers/navigation/news';

import { TooltipProvider } from '@/components/ui/tooltip';

const NavigationMobile = () => {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="bg-brand-600 pointer-events-auto fixed bottom-0 left-0 z-50 flex h-20 w-screen items-center justify-center space-x-6 bg-[url(/images/mobile-sidebar-bg.svg)] bg-cover bg-bottom bg-no-repeat">
        <Locations />
        <News />
        <ConfigureWidgets />
        <LanguageSelector />
        <MapToggle />
      </div>
    </TooltipProvider>
  );
};

export default NavigationMobile;
