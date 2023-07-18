import React, { useCallback, ReactElement, FC } from 'react';

import cn from 'lib/classnames';

import { drawingToolAtom } from 'store/drawing-tool';
import { widgetsCollapsedAtom } from 'store/widgets';

import { AnimatePresence, motion } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';

import Helper from 'containers/guide/helper';
import { useWidgets } from 'containers/widgets/hooks';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/dialog';
import WidgetControls from 'components/widget-controls';
import { WidgetSlugType } from 'types/widget';

import Info from './info.mdx';
import { getWidgetActive } from './selector';

type ChildrenType = ReactElement & { type?: () => null };

type WidgetLayoutProps = {
  id: WidgetSlugType;
  title: string;
  children: ChildrenType | null;
  className?: string;
  contextualLayersIds?: string[];
  applicability?: string;
};

const WidgetWrapper: FC<WidgetLayoutProps> = (props: WidgetLayoutProps): null | any => {
  const { children, title, id, className, applicability } = props;
  const { showWidget } = useRecoilValue(drawingToolAtom);

  const isWidgetActive = useRecoilValue(getWidgetActive(id));

  const [widgetsCollapsed, setWidgetsCollapsed] = useRecoilState(widgetsCollapsedAtom);
  const widgets = useWidgets();
  const HELPER_ID = widgets[0].slug;

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
          'md:h-fit-content z-2 group ml-[3%] w-[94%] rounded-2xl border border-[#DADED0] bg-white px-1 py-1 shadow-widget md:ml-0 md:w-[540px]':
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
          <header className="flex items-center justify-between ">
            <Helper
              className={{
                button: HELPER_ID === id && !showWidget ? '-bottom-7.5 -right-6 z-[20]' : 'hidden',
                tooltip: 'w-fit-content',
              }}
              tooltipPosition={{ top: 60, left: 0 }}
              message="Click to expand/collapse widgets"
            >
              <h2
                onClick={handleWidgetCollapsed}
                className="flex-1 cursor-pointer py-5 text-xs font-bold uppercase -tracking-tighter text-black/85 group-last-of-type:pointer-events-none"
              >
                {title}
              </h2>
            </Helper>
            <WidgetControls id={id} />
          </header>
          <div
            className={cn({
              'group-last-of-type:block': true,
              hidden: widgetsCollapsed[id],
              block: !widgetsCollapsed[id],
            })}
          >
            {children}
          </div>
          {applicability && (
            <p
              className={cn({
                'text-center text-sm text-black/85': true,
                hidden: widgetsCollapsed[id],
                block: !widgetsCollapsed[id],
              })}
            >
              <span className="font-normal">Data applicability:</span>{' '}
              <span className="font-light">{applicability}.</span>{' '}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="flex justify-center text-brand-800 underline">Learn more</div>
                </DialogTrigger>
                <DialogContent className="top-24 rounded-3xl">
                  {/* <h2>Data applicability</h2> */}
                  <Info />

                  <DialogClose />
                </DialogContent>
              </Dialog>
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WidgetWrapper;
