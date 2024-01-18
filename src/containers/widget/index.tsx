import React, { useCallback, ReactElement, FC } from 'react';

import cn from 'lib/classnames';

import { widgetsCollapsedAtom } from 'store/widgets';

import { AnimatePresence, motion } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/dialog';
import WidgetControls from 'components/widget-controls';
import { WidgetSlugType } from 'types/widget';

import Info from './info.mdx';
import { getLayerActive } from './selector';

type ChildrenType = ReactElement & { type?: () => null };

type WidgetLayoutProps = {
  id: WidgetSlugType;
  title: string;
  children: ChildrenType | null;
  className?: string;
  contextualLayersIds?: string[];
  applicability?: string;
  info?: boolean;
};

const WidgetWrapper: FC<WidgetLayoutProps> = (props: WidgetLayoutProps) => {
  const { children, title, id, className, applicability, info } = props;

  const isLayerActive = useRecoilValue(getLayerActive(id));

  const [widgetsCollapsed, setWidgetsCollapsed] = useRecoilState(widgetsCollapsedAtom);

  const handleWidgetCollapsed = useCallback(() => {
    const updatedWidgetsCollapsed = {
      ...widgetsCollapsed,
      [id]: !widgetsCollapsed[id],
      ['mangrove_drawing_tool']: false,
      ['mangrove_drawing_upload_tool']: false,
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
        transition={{ type: 'tween', bounce: 0, duration: 0.6 }}
        className={cn({
          'md:h-fit-content z-2 group w-full rounded-4xl bg-white px-1 py-1 shadow-widget print:!w-[90%] md:ml-0':
            true,
          '!w-[100%] border-none !p-0 !shadow-none': info,
          [className]: !!className,
        })}
      >
        <div
          className={cn({
            'rounded-3xl border border-transparent px-9 py-3': true,
            'border-2 border-brand-800 border-opacity-25 transition delay-150 ease-in-out':
              isLayerActive,
            'border-none p-0': info,
          })}
          data-testid={`widget-${id}`}
        >
          <header className="flex items-center justify-between">
            <h2
              onClick={handleWidgetCollapsed}
              className="flex-1 cursor-pointer py-5 text-xs font-bold uppercase -tracking-tighter text-black/85 group-last-of-type:pointer-events-none"
            >
              {title}
            </h2>

            {!info && <WidgetControls id={id} />}
          </header>
          <div
            data-testid={`widget-${id}-content`}
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
                'flex text-sm text-black/85 md:whitespace-nowrap md:text-center': true,
                hidden: widgetsCollapsed[id],
                block: !widgetsCollapsed[id],
              })}
            >
              <span className="font-normal">Data applicability:</span>{' '}
              <span className="font-light">{applicability}.</span>{' '}
              <Dialog>
                <DialogTrigger>
                  <div className="inline-flex text-brand-800 underline">Learn more</div>
                </DialogTrigger>
                <DialogContent className="md:mb-20">
                  <div className="no-scrollbar overflow-y-auto">
                    <Info />
                  </div>
                  <DialogClose className="fixed !top-18 left-[595px]" />
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
