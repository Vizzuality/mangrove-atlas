import Helper from 'containers/guide/helper';
import GuideSwitcher from 'containers/guide/switcher';
import LanguageSelector from 'containers/navigation/language-selector';
import Menu from 'containers/navigation/menu';

import News from './news';
const HELPER_ID = 'menu-categories';

const AppTools = () => (
  <div className="absolute top-2 left-0 z-50 flex w-[540px] items-center justify-between space-x-4 rounded-full bg-brand-800 py-2 px-8 shadow-md print:hidden">
    <Menu />

    {process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' && <News />}
    <Helper
      className={{
        button: HELPER_ID ? '-bottom-10 -right-1.5 z-[20]' : 'hidden',
        tooltip: 'w-fit-content',
      }}
      tooltipPosition={{ top: -40, left: -50 }}
      message="language selector"
    >
      <LanguageSelector />
    </Helper>
    <Helper
      className={{
        button: HELPER_ID ? '-bottom-10 -right-1.5 z-[20]' : 'hidden',
        tooltip: 'w-fit-content',
      }}
      tooltipPosition={{ top: -40, left: -50 }}
      message="guide"
    >
      <GuideSwitcher />
    </Helper>
  </div>
);

export default AppTools;
