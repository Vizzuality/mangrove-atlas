import { useState } from 'react';

import cn from 'lib/classnames';

import { allWidgetsCollapsedAtom } from 'store/widgets';

import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';

import WidgetControls from 'components/widget-controls';
import { WidgetSlugType } from 'types/widget';

import { getWidgetActive } from './selector';

type WidgetLayoutProps = {
  id: WidgetSlugType;
  title: string;
  children: React.ReactNode;
  className?: string;
};

const WidgetWrapper: React.FC<WidgetLayoutProps> = (props: WidgetLayoutProps) => {
  const { children, title, id, className } = props;
  const [isCollapsed, setIsCollapsed] = useState<Partial<Record<WidgetSlugType, boolean>>>({});
  const isWidgetActive = useRecoilValue(getWidgetActive(id));

  const allWidgetsCollapsed = useRecoilValue(allWidgetsCollapsedAtom);

  return (
    <motion.div
      animate={{
        // marginBottom: isCollapsed[id] ? 0 : '-70px',
        // marginTop: isCollapsed[id] ? 0 : '-3px',
        boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 12px rgba(0, 0, 0, 0.08)',
      }}
      className={cn({
        'md:h-fit-conten ml-[3%] w-[94%] rounded-2xl border border-[#DADED0] bg-white px-10 pt-4 shadow-3xl md:ml-0 md:w-[540px]':
          true,
        '-mb-3 md:-mb-9': isCollapsed[id] || allWidgetsCollapsed,
        'ring-[2px] ring-inset ring-brand-800/30 ring-offset-4': isWidgetActive,
        [className]: !!className,
      })}
    >
      {/* Content */}
      <header className="flex items-center justify-between">
        <h2
          onClick={() => setIsCollapsed({ ...isCollapsed, [id]: !isCollapsed[id] })}
          className="flex-1 cursor-pointer py-5 text-xs font-bold uppercase -tracking-tighter text-black/85"
        >
          {title}
        </h2>
        <WidgetControls id={id} />
      </header>
      {allWidgetsCollapsed && children}
    </motion.div>
  );
};

export default WidgetWrapper;
