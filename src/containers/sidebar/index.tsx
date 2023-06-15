import Menu from 'containers/sidebar/menu';

import Category from './category';
import Place from './place';

const Sidebar = () => {
  return (
    <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-full bg-[url('/images/sidebar-bg.png')] bg-[top_left_-16px] bg-no-repeat print:hidden">
      <div className="pointer-events-auto relative top-28 inline-flex h-full w-18 flex-col items-start space-y-5 bg-brand-600 pl-2.5">
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
