import Helper from 'containers/guide/helper';
import GuideSwitcher from 'containers/guide/switcher';
import LanguageSelector from 'containers/navigation/language-selector';
import Menu from 'containers/navigation/menu';
import News from 'containers/navigation/news';

const HELPER_ID = 'menu-categories';

const AppTools = () => (
  <div className="absolute top-2 left-0 z-20 flex h-11 w-full items-center justify-between space-x-4 rounded-full bg-brand-800 px-8 shadow-md print:hidden">
    <Menu />

    {process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' && <News />}

    <LanguageSelector />

    <Helper
      className={{
        button: HELPER_ID ? '-top-2.5 -right-4 z-20' : 'hidden',
        tooltip: 'w-fit-content',
      }}
      theme="dark"
      tooltipPosition={{ top: -40, left: 0 }}
      message="guide"
    >
      <GuideSwitcher />
    </Helper>
  </div>
);

export default AppTools;
