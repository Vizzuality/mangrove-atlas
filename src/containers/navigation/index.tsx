import HelpContainer from 'containers/help';
import Helper from 'containers/help/helper';
import LanguageSelector from 'containers/navigation/language-selector';
import Menu from 'containers/navigation/menu';
import News from 'containers/navigation/news';

const HELPER_ID = 'menu-categories';

const AppTools = () => (
  <div className="fixed top-2 left-4 z-20 hidden h-11 w-[526px] rounded-[32px] bg-brand-800 px-5 shadow-md print:hidden md:block">
    {/* <div className="grid h-full grid-cols-4 gap-4"> */}
    <div className="flex h-full items-center justify-around">
      <div className="flex items-center justify-center">
        <Menu />
      </div>

      <div className="flex items-center justify-center">
        <News />
      </div>

      <div className="flex items-center justify-center">
        <LanguageSelector />
      </div>

      <div className="flex h-full items-center justify-center">
        <Helper
          className={{
            button: HELPER_ID ? '-top-2.5 -right-4 z-20' : 'hidden',
            tooltip: 'w-fit-content',
          }}
          tooltipPosition={{ top: -40, left: 0 }}
          message="Contact the GMW team or activate a tour of the platform."
        >
          <HelpContainer />
        </Helper>
      </div>
    </div>
  </div>
);

export default AppTools;
