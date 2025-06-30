import { FC, ReactElement } from 'react';

import cn from 'lib/classnames';

import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';
import { widgetsCollapsedAtom } from 'store/widgets';

import { AnimatePresence, motion } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';

import WidgetControls from 'components/widget-controls';
import { WidgetSlugType } from 'types/widget';

import WidgetApplicability from './applicability';
import WidgetHeader from './header';
import { getLayerActive } from './selector';
import Helper from 'containers/help/helper';
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
  const { enabled: isDrawingToolEnabled } = useRecoilValue(drawingToolAtom);
  const { enabled: isDrawingUploadToolEnabled } = useRecoilValue(drawingUploadToolAtom);
  const isLayerActive = useRecoilValue(getLayerActive(id));

  const [widgetsCollapsed] = useRecoilState<Record<string, boolean>>(widgetsCollapsedAtom);

  const widgetVariants = {
    collapsed: {
      marginBottom: '-24px',
    },
    expanded: {
      marginBottom: '12px',
    },
  };

  if (Boolean(children.type() === null)) return null;

  const isCollapsed: boolean =
    isDrawingToolEnabled || isDrawingUploadToolEnabled ? false : widgetsCollapsed[id];

  return (
    <AnimatePresence>
      <motion.div
        initial={false}
        variants={widgetVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        exit="expanded"
        transition={{ type: 'tween', bounce: 0, duration: 0.6 }}
        className={cn({
          'z-2 group w-full rounded-4xl bg-white px-1 py-1 shadow-widget print:!w-[90%] md:ml-0':
            true,
          '!w-[100%] border-none !p-0 !shadow-none': info,
          [className]: !!className,
        })}
      >
        <div
          className={cn({
            'rounded-3xl border-2 border-transparent px-9 py-3': true,
            'border-brand-800 border-opacity-25 transition delay-150 ease-in-out': isLayerActive,
            'border-none p-0': info,
          })}
          data-testid={`widget-${id}`}
        >
          <Helper
            className={{
              button: id === 'widgets_deck_tool' ? 'top-0 -right-6 z-20' : 'hidden',
              tooltip: 'max-w-[400px]',
            }}
            tooltipPosition={{ top: -50, left: 0 }}
            message="Opens deck to select which widgets and map layers are displayed on the left side of the screen. Widgets provide information and statistics about a selected geography, protected area, or user-inputted polygon. Most widgets also come with a map layer that can be toggled on and off. Users can select groups of widgets organized by theme or customize their own combination of widgets and map layers. Some layers and widgets are not available for certain locations. Select applicable geography to enable layer."
          >
            <WidgetHeader title={title} id={id}>
              {!info && <WidgetControls id={id} />}
            </WidgetHeader>
          </Helper>

          <div
            data-testid={`widget-${id}-content`}
            className={cn({
              'group-last-of-type:block': true,
              hidden: isCollapsed,
              block: !isCollapsed,
            })}
          >
            {children}
          </div>
          {applicability && <WidgetApplicability id={id} applicability={applicability} />}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WidgetWrapper;
