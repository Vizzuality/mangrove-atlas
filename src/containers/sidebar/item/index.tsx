import cn from 'lib/classnames';

const Sidebar = ({ title, children }) => {
  return (
    <div>
      <div className="font-lato w-full py-2 text-center text-xxs leading-[10px] text-white">
        {title}
      </div>
      <div
        className={cn({
          'active:brand-800 flex flex-col items-center justify-center space-y-4 rounded-full bg-white p-1.5 text-brand-800 hover:bg-brand-800 hover:text-white active:text-white':
            true,
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
