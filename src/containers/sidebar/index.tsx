import Menu from 'containers/sidebar/menu';
import Place from 'containers/sidebar/place';

import Category from './category';

const Sidebar = () => {
  return (
    <div className="absolute top-0 left-0 z-10 flex h-screen w-[80px] flex-col items-start justify-start space-y-5 bg-brand-600 p-2.5 py-20">
      <div>
        <Menu />
      </div>

      <Place />

      <Category />
    </div>
  );
};

export default Sidebar;
