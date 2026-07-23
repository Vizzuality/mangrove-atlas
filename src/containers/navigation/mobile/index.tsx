import ConfigureWidgets from '@/containers/navigation/mobile/configure';
import LanguageSelector from '@/containers/navigation/mobile/language-selector';
import Locations from '@/containers/navigation/mobile/locations';
import News from '@/containers/navigation/news';

import { TooltipProvider } from '@/components/ui/tooltip';

const NavigationMobile = () => {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="pointer-events-auto fixed inset-x-4 bottom-4 z-50">
        <div className="bg-brand-800 flex items-center justify-between rounded-[32px] px-8 py-2 shadow-[0px_4px_6px_rgba(0,60,57,0.15)]">
          <Locations />
          <News />
          <ConfigureWidgets />
          <LanguageSelector />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default NavigationMobile;
