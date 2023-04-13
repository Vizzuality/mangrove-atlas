import cn from 'lib/classnames';

const Sidebar = () => {
  return (
    <div
      className={cn({
        'absolute top-0 left-0 z-10 h-screen w-[80px] bg-brand-600': true,
      })}
    ></div>
  );
};

export default Sidebar;
