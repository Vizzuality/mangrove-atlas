import dynamic from 'next/dynamic';

import Menu from 'containers/sidebar/menu';

import Category from './category';

const Place = dynamic(() => import('../../containers/sidebar/place'), {
  ssr: false,
});

const Sidebar = () => {
  return (
    <div className="pointer-events-none absolute top-0  bottom-0 left-0 w-full bg-[url('/images/sidebar-bg.png')] bg-left-top bg-no-repeat">
      <div className="pointer-events-auto relative top-28 inline-flex h-full w-18 flex-col items-center space-y-5 bg-brand-600">
        <div>
          <Menu />
        </div>
        <Place />
        <Category />
      </div>
    </div>
  );
};

export default Sidebar;
