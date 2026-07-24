import HelpContainer from '@/containers/help';
import Menu from '@/containers/navigation/menu';
import LanguageSelector from '@/containers/navigation/mobile/language-selector';
import News from '@/containers/navigation/news';

import { TooltipProvider } from '@/components/ui/tooltip';

const NavigationMobile = () => {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="pointer-events-auto fixed inset-x-4 bottom-4 z-50">
        <div className="bg-brand-800 flex items-center justify-around rounded-[32px] px-8 py-2 shadow-[0px_4px_6px_rgba(0,60,57,0.15)]">
          <Menu variant="mobile" />
          <News />
          <LanguageSelector />
          <HelpContainer variant="mobile" />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default NavigationMobile;
