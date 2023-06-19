import React, { useCallback, ReactElement } from 'react';

import cn from 'lib/classnames';

import { widgetsCollapsedAtom } from 'store/widgets';

import { AnimatePresence, motion } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';

import WidgetControls from 'components/widget-controls';
import { WidgetSlugType } from 'types/widget';

import { getWidgetActive } from './selector';

type ChildrenType = ReactElement<any> & { type?: () => null };

type WidgetLayoutProps = {
  id: WidgetSlugType;
  title: string;
  children: ChildrenType | null;
  className?: string;
};

const WidgetWrapper: React.FC<WidgetLayoutProps> = (props: WidgetLayoutProps): null | any => {
  const { children, title, id, className } = props;

  const isWidgetActive = useRecoilValue(getWidgetActive(id));

  const [widgetsCollapsed, setWidgetsCollapsed] = useRecoilState(widgetsCollapsedAtom);

  const handleWidgetCollapsed = useCallback(() => {
    const updatedWidgetsCollapsed = {
      ...widgetsCollapsed,
      [id]: !widgetsCollapsed[id],
      ['mangrove_drawing_tool']: false,
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

  const widgetContentVariants = {
    collapsed: {
      display: 'none',
      height: 0,
      opacity: 0,
    },
    expanded: {
      display: 'block',
      height: 'auto',
      opacity: 1,
    },
  };

  if (Boolean(children.type() === null)) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={false}
        variants={widgetVariants}
        animate={widgetsCollapsed[id] ? 'collapsed' : 'expanded'}
        exit="expanded"
        transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
        className={cn({
          'md:h-fit-content ml-[3%] w-[94%] rounded-2xl border border-[#DADED0] bg-white px-1 py-1 shadow-widget md:ml-0 md:w-[540px]':
            true,
          [className]: !!className,
        })}
      >
        <div
          className={cn({
            'rounded-2xl border-2 border-transparent px-9 py-3': true,
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
          <motion.div
            initial={false}
            variants={widgetContentVariants}
            animate={widgetsCollapsed[id] ? 'collapsed' : 'expanded'}
            exit="expanded"
            transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
            className={cn({
              hidden: widgetsCollapsed[id],
              block: !widgetsCollapsed[id],
              'last-of-type:block': true, //prevent last widget to collapse
            })}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WidgetWrapper;
