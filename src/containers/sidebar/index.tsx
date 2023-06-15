import Menu from 'containers/sidebar/menu';

import Category from './category';
import Place from './place';

const Sidebar = () => {
  return (
    <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-full  bg-[url('/images/sidebar-bg.png')] bg-[top_left_0px] bg-no-repeat">
      <div className="pointer-events-auto relative top-28 inline-flex h-full w-22 flex-col items-start space-y-5 bg-brand-600 pl-4">
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
