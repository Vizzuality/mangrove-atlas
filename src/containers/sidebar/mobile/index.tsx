import Menu from 'containers/sidebar/menu';
import CategoryMobile from 'containers/sidebar/mobile/category';

const Sidebar = () => {
  return (
    <div className="absolute bottom-0 z-10 w-screen bg-[url('/images/sidebar-bg.png')] bg-no-repeat">
      <div className="item-center flex h-full w-full justify-center space-x-10 bg-brand-600 py-3 px-6">
        <Menu />
        <CategoryMobile />
      </div>
    </div>
  );
};

export default Sidebar;
