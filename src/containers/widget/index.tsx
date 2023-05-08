import { useState } from 'react';

import cn from 'lib/classnames';

import { motion } from 'framer-motion';

import WidgetControls from 'components/widget-controls';
import { WidgetSlugType } from 'types/widget';
type WidgetLayoutProps = {
  id: WidgetSlugType;
  title: string;
  children: React.ReactNode;
};

const WidgetWrapper: React.FC<WidgetLayoutProps> = (props: WidgetLayoutProps) => {
  const { children, title, id } = props;
  const [isCollapsed, setIsCollapsed] = useState({});
  return (
    <motion.div
      animate={
        {
          // height: isCollapsed[id] ? 100,
          // boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 12px rgba(0, 0, 0, 0.08)',
        }
      }
      className={cn({
        'w-[540px] grow rounded-2xl border border-[#DADED0] bg-white px-10 pt-1 shadow-3xl': true,
        '-mb-9': isCollapsed[id],
      })}
    >
      {/* Content */}
      <header className="flex items-center justify-between">
        <h2
          onClick={() => setIsCollapsed({ ...isCollapsed, [id]: !isCollapsed[id] })}
          className="flex-1 cursor-pointer py-6 text-xs font-bold uppercase -tracking-tighter text-black/85"
        >
          {title}
        </h2>
        <WidgetControls id={id} />
      </header>
      <div className={cn({ hidden: isCollapsed[id] })}>{children}</div>
    </motion.div>
  );
};

export default WidgetWrapper;
