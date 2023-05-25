import { useCallback } from 'react';

import cn from 'lib/classnames';

import { widgetsCollapsedAtom } from 'store/widgets';

import { AnimatePresence, motion } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';

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

  const isWidgetActive = useRecoilValue(getWidgetActive(id));

  const [widgetsCollapsed, setWidgetsCollapsed] = useRecoilState(widgetsCollapsedAtom);

  const handleWidgetCollapsed = useCallback(() => {
    const updatedWidgetsCollapsed = {
      ...widgetsCollapsed,
      [id]: !widgetsCollapsed[id],
    };
    setWidgetsCollapsed(updatedWidgetsCollapsed);
  }, [id, widgetsCollapsed, setWidgetsCollapsed]);

  const widgetVariants = {
    collapsed: {
      marginBottom: '-24px',
    },
    expanded: {
      marginBottom: '12px',
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={false}
        variants={widgetVariants}
        animate={widgetsCollapsed[id] ? 'collapsed' : 'expanded'}
        exit="expanded"
        transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
        className={cn({
          'md:h-fit-content ml-[3%] w-[94%] rounded-2xl border border-[#DADED0] bg-white px-1 py-1 md:ml-0 md:w-[540px]':
            true,
          [className]: !!className,
        })}
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 12px 4px',
        }}
      >
        <div
          className={cn({
            'rounded-2xl border-2 border-transparent px-9 pt-3 pb-5': true,
            'border-brand-800 transition delay-150 ease-in-out': isWidgetActive,
          })}
        >
          <header className="flex items-center justify-between">
            <h2
              onClick={handleWidgetCollapsed}
              className="flex-1 cursor-pointer py-5 text-xs font-bold uppercase -tracking-tighter text-black/85"
            >
              {title}
            </h2>
            <WidgetControls id={id} />
          </header>

          {!widgetsCollapsed[id] && children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WidgetWrapper;
