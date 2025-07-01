import { useCallback, useMemo, FC } from 'react';

import cn from 'lib/classnames';

import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';
import { locationToolAtom } from 'store/sidebar';
import { activeWidgetsAtom } from 'store/widgets';

import { motion } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useWindowSize } from 'usehooks-ts';

import WidgetsLayout from 'layouts/widgets';

import Category from 'containers/categories-menu';
import { WIDGETS } from 'containers/datasets';
import CloseHelpGuide from 'containers/help/close';
import Helper from 'containers/help/helper';
import AppTools from 'containers/navigation';
import WidgetWrapper from 'containers/widget';
import { widgets, ANALYSIS_WIDGETS_SLUGS } from 'containers/widgets/constants';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/ui/dialog';
import Icon from 'components/ui/icon';
import { breakpoints } from 'styles/styles.config';
import { BUTTON_STYLES } from 'styles/widgets';
import { WidgetTypes } from 'types/widget';

import SETTINGS_SVG from 'svgs/ui/settings.svg?sprite';

import { useWidgets } from './hooks';
import WidgetsCardsControls from './widgets-cards-controls';
import WidgetsMenu from './widgets-menu';

const buttonMotion = {
  rest: {
    width: 48,
    x: 0,
    transition: {
      duration: 0.2,
      type: 'tween',
      ease: 'easeIn',
    },
  },
  hover: {
    width: 140,
    x: -46,
    transition: {
      duration: 0.2,
      type: 'tween',
      ease: 'easeOut',
    },
  },
};

const textMotion = {
  rest: {
    opacity: 0,
    transition: { ease: 'easeOut', duration: 0.2, type: 'tween', x: 140, width: 0 },
  },
  hover: {
    opacity: 1,
    x: 0,
    width: 140,
    transition: {
      duration: 0.4,
      type: 'tween',
      ease: 'easeIn',
    },
  },
};

const HELPER_ID = 'menu-categories';
const WidgetsContainer: FC = () => {
  const [{ customGeojson }] = useRecoilState(drawingToolAtom);

  const [{ uploadedGeojson }] = useRecoilState(drawingUploadToolAtom);

  const { width: screenWidth } = useWindowSize();
  const [activeWidgets] = useRecoilState(activeWidgetsAtom);
  const enabledWidgets = useWidgets();
  const widgetsAvailable = useMemo(() => {
    if (customGeojson || uploadedGeojson) {
      return widgets.filter(({ slug }) => ANALYSIS_WIDGETS_SLUGS.includes(slug));
    }
    return enabledWidgets.filter(
      ({ slug }) => activeWidgets?.includes(slug) || slug === 'widgets_deck_tool'
    );
  }, [activeWidgets, enabledWidgets, customGeojson, uploadedGeojson]) satisfies WidgetTypes[];

  const locationTool = useRecoilValue(locationToolAtom);

  const onClickDownload = useCallback(() => {
    setTimeout(() => {
      window.print();
    }, 2000);
  }, []);

  return (
    <WidgetsLayout>
      <AppTools />
      <CloseHelpGuide />

      <WidgetsCardsControls />

      {screenWidth > 0 && screenWidth < breakpoints.md && !!widgets.length && (
        <div className="pb-16 md:pb-0">
          {widgetsAvailable.map(({ slug, name, ...props }) => {
            const Widget = WIDGETS[slug] satisfies () => JSX.Element;
            return (
              <WidgetWrapper key={slug} title={name} id={slug} applicability={props?.applicability}>
                {WIDGETS[slug] && <Widget />}
              </WidgetWrapper>
            );
          })}
        </div>
      )}

      {screenWidth > 0 && screenWidth >= breakpoints.md && (
        <div
          data-testid="widgets-wrapper"
          className="print:m-auto print:grid print:w-screen print:grid-cols-2 print:pr-24"
        >
          {widgetsAvailable.map(({ slug, name, ...props }) => {
            const Widget = WIDGETS[slug];
            return (
              <WidgetWrapper
                key={slug}
                title={name}
                id={slug}
                applicability={props?.applicability}
                className={cn({
                  'print:min-w-[480px] print:scale-95 print:transform print:break-inside-avoid':
                    true,
                })}
              >
                {WIDGETS[slug] && <Widget />}
              </WidgetWrapper>
            );
          })}
        </div>
      )}
      <Dialog>
        <Helper
          className={{
            button: 'right-0 -top-1.5 z-20',
            tooltip: 'w-fit-content',
          }}
          tooltipPosition={{ top: -50, left: 0 }}
          message="Opens deck to select which widgets and map layers are displayed on the left side of the screen. Widgets provide information and statistics about a selected geography, protected area, or user-inputted polygon. Most widgets also come with a map layer that can be toggled on and off. Users can select groups of widgets organized by theme or customize their own combination of widgets and map layers. Some layers and widgets are not available for certain locations. Select applicable geography to enable layer."
        >
          <DialogTrigger asChild>
            <motion.div
              initial="rest"
              whileHover="hover"
              animate="rest"
              // centers the button in the middle of the sidebar (sidebar width less the button width divided by 2)
              className="fixed bottom-3 left-[calc((560px-48px)/2)] z-20 print:hidden"
            >
              <motion.button
                className="flex min-w-[48px] items-center space-x-4 rounded-full bg-brand-800 p-4 text-xs font-semibold text-white shadow-control"
                variants={buttonMotion}
              >
                <Icon icon={SETTINGS_SVG} className="h-4 w-4 flex-shrink-0" />
                <motion.span variants={textMotion} className="whitespace-nowrap">
                  Widgets deck
                </motion.span>
              </motion.button>
            </motion.div>
          </DialogTrigger>
        </Helper>
        <DialogContent className="mb-10 w-screen border-2 md:w-auto">
          <DialogClose className="top-8 md:fixed md:!top-18 md:left-[595px]" />
          <div className="no-scrollbar space-y-8">
            <h2 className="font-black/85 text-3xl font-light leading-10">Widgets deck settings</h2>
            <Helper
              className={{
                button: HELPER_ID ? '-bottom-9 right-40 z-20' : 'hidden',
                tooltip: 'w-80',
              }}
              tooltipPosition={{ top: -20, left: 0 }}
              message="Opens deck to select which widgets and map layers are displayed on the left side of the screen. Widgets provide information and statistics about a selected geography, protected area, or user-inputted polygon. Most widgets also come with a map layer that can be toggled on and off. Users can select groups of widgets organized by theme or customize their own combination of widgets and map layers. Some layers and widgets are not available for certain locations. Select applicable geography to enable layer."
            >
              <Category />
            </Helper>
            <Helper
              className={{
                button: HELPER_ID ? 'right-72 -bottom-4 z-20' : 'hidden',
                tooltip: 'w-fit-content',
              }}
              tooltipPosition={{ top: -70, left: -400 }}
              message="Widgets list"
            >
              <WidgetsMenu />
            </Helper>
          </div>
        </DialogContent>
      </Dialog>
      {/* <div className="flex w-full justify-center py-4 print:hidden">
        <Helper
          className={{
            button:
              locationTool === 'upload' || locationTool === 'area'
                ? 'hidden'
                : '-bottom-2.5 -right-0',
            tooltip: 'w-fit-content',
          }}
          tooltipPosition={{ top: 50, left: 10 }}
          message="use this button to download the current map view and associated widgets as a pdf file"
        >
          <button
            className={cn({
              [BUTTON_STYLES]: true,
              'm-auto bg-brand-800 text-white': true,
              // hidden: !customGeojson && !uploadedGeojson,
            })}
            // disabled={!customGeojson && !uploadedGeojson}
            onClick={onClickDownload}
          >
            Download report as PDF
          </button>
        </Helper>
      </div> */}
      {!!widgets.length ? (
        <div className="flex w-full justify-center py-4 print:hidden">
          <Helper
            className={{
              button:
                locationTool === 'upload' || locationTool === 'area'
                  ? 'hidden'
                  : '-bottom-2.5 -right-0',
              tooltip: 'w-fit-content',
            }}
            tooltipPosition={{ top: 50, left: 10 }}
            message="use this button to download the current map view and associated widgets as a pdf file"
          >
            <button
              className={cn({
                [BUTTON_STYLES]: true,
                'm-auto bg-brand-800 text-white': true,
                hidden: !customGeojson && !uploadedGeojson,
              })}
              disabled={!customGeojson && !uploadedGeojson}
              onClick={onClickDownload}
            >
              Download report as PDF
            </button>
          </Helper>
        </div>
      ) : null}
    </WidgetsLayout>
  );
};

export default WidgetsContainer;
