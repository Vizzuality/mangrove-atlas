import Menu from 'containers/sidebar/menu';
import Place from 'containers/sidebar/place';

import Category from './category';

const Sidebar = () => {
  return (
    <div className="absolute top-0 -left-4 bottom-0 z-10 w-screen bg-[url('/images/sidebar-bg.png')] bg-no-repeat">
      <div className="mt-40 flex h-full w-[88px] flex-col items-start justify-start  space-y-5 bg-brand-600 p-6">
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
