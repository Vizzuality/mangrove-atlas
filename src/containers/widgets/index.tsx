import { useCallback, useEffect, useMemo, FC } from 'react';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';
import { locationToolAtom } from 'store/sidebar';
import { activeCategoryAtom } from 'store/sidebar';
import { widgetsCollapsedAtom } from 'store/widgets';
import { activeWidgetsAtom } from 'store/widgets';

import { motion } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useWindowSize } from 'usehooks-ts';

import WidgetsLayout from 'layouts/widgets';

import Category from 'containers/categories-menu';
import { WIDGETS } from 'containers/datasets';
import { LocationTypes } from 'containers/datasets/locations/types';
import Helper from 'containers/guide/helper';
import AppTools from 'containers/navigation';
import WidgetWrapper from 'containers/widget';
import { widgets, ANALYSIS_WIDGETS_SLUGS } from 'containers/widgets/constants';
import { useWidgetsIdsByCategory } from 'containers/widgets/hooks';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/ui/dialog';
import Icon from 'components/ui/icon';
import { breakpoints } from 'styles/styles.config';
import { BUTTON_STYLES } from 'styles/widgets';
import { WidgetTypes } from 'types/widget';

import ALERT_SVG from 'svgs/ui/alert.svg?sprite';
import SETTINGS_SVG from 'svgs/ui/settings.svg?sprite';

import { useWidgets } from './hooks';
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
  const [categorySelected] = useRecoilState(activeCategoryAtom);
  const [{ customGeojson }] = useRecoilState(drawingToolAtom);

  const {
    query: { params },
  } = useRouter();

  // Params as default don't appear in URL, when there is no location we assume worldwide
  const locationType = (params?.[0] || 'worldwide') as LocationTypes;
  const [{ uploadedGeojson }] = useRecoilState(drawingUploadToolAtom);

  const { width: screenWidth } = useWindowSize();
  const [activeWidgets, setActiveWidgets] = useRecoilState(activeWidgetsAtom);
  const enabledWidgets = useWidgets();
  const widgetsAvailable = useMemo(() => {
    if (customGeojson || uploadedGeojson) {
      return widgets.filter(({ slug }) => ANALYSIS_WIDGETS_SLUGS.includes(slug));
    }
    return enabledWidgets.filter(
      ({ slug }) => activeWidgets?.includes(slug) || slug === 'widgets_deck_tool'
    );
  }, [activeWidgets, enabledWidgets, customGeojson, uploadedGeojson]) satisfies WidgetTypes[];

  const cat = useWidgetsIdsByCategory(activeWidgets);

  // ensures that the appropriate widgets for a selected category are activated during
  // the first render. This is crucial when the initial state is being loaded from a URL,
  //  particularly in cases where the active widgets are not immediately visible on it

  useEffect(() => {
    if (categorySelected !== cat) {
      const filteredWidgets = widgetsAvailable.map(({ slug }) => slug);
      setActiveWidgets(filteredWidgets);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const locationTool = useRecoilValue(locationToolAtom);

  const [widgetsCollapsed, setWidgetsCollapsed] = useRecoilState(widgetsCollapsedAtom);

  const widgetsCollapsedChecker = Object.values(widgetsCollapsed)?.includes(true);

  const handleWidgetsCollapsed = useCallback(() => {
    const updateWidgetsCollapsed = Object.keys(widgetsCollapsed).reduce((acc, key) => {
      acc[key] = widgetsCollapsedChecker ? false : true;
      return acc;
    }, {});

    updateWidgetsCollapsed['widgets_deck_tool'] = false;
    updateWidgetsCollapsed['mangrove_drawing_tool'] = false;
    updateWidgetsCollapsed['mangrove_drawing_upload_tool'] = false;

    setWidgetsCollapsed(updateWidgetsCollapsed);
  }, [widgetsCollapsed, widgetsCollapsedChecker, setWidgetsCollapsed]);

  const onClickDownload = useCallback(() => {
    setTimeout(() => {
      window.print();
    }, 2000);
  }, []);

  const activeWidgetsFilteredByLocationType = widgets
    .filter((w) => w.locationType?.includes(locationType))
    .map(({ slug }) => slug);

  const filteredWidgetsToDisplay = activeWidgetsFilteredByLocationType.filter(
    (element) => activeWidgets.includes(element) && element !== 'widgets_deck_tool'
  );

  return (
    <WidgetsLayout>
      <AppTools />
      <div className="py-1">
        <div
          className={cn({
            'grid w-full grid-cols-2 justify-between gap-1 print:hidden': true,
            hidden: locationTool === 'area' || locationTool === 'upload',
          })}
        >
          <Dialog>
            <Helper
              className={{
                button: 'right-0 -top-1.5 z-20',
                tooltip: 'w-fit-content',
              }}
              tooltipPosition={{ top: -50, left: 0 }}
              message="Triggers deck to configure widgets"
            >
              <DialogTrigger asChild>
                <button
                  type="button"
                  data-testid="widgets-deck-trigger"
                  className={cn({
                    'ml-1 flex h-8 w-full items-center justify-center rounded-4xl bg-white py-1 px-10 font-sans text-sm font-semibold text-brand-800 shadow-control transition-colors print:hidden md:ml-0 md:w-[262px]':
                      true,
                  })}
                >
                  <p>
                    Widgets deck <span>({filteredWidgetsToDisplay.length})</span>
                  </p>
                </button>
              </DialogTrigger>
            </Helper>
            <DialogContent className="mb-10 w-screen border-2 md:w-auto">
              <DialogClose className="top-8 md:fixed md:!top-18 md:left-[595px]" />
              <div className="no-scrollbar space-y-8">
                <h2 className="font-black/85 text-3xl font-light leading-10">
                  Widgets deck settings
                </h2>
                <Helper
                  className={{
                    button: HELPER_ID ? '-bottom-9 right-40 z-20' : 'hidden',
                    tooltip: 'w-80',
                  }}
                  tooltipPosition={{ top: -20, left: 0 }}
                  message="Widgets display information and statistics about a geometry on the map. Most widgets also come with map layer that can be toggled on or off"
                >
                  <Category />
                </Helper>
                <div className="flex w-full items-center space-x-4 rounded-3xl bg-gray-50 p-2.5 shadow-control">
                  <Icon
                    icon={ALERT_SVG}
                    className="h-16 w-16 fill-current text-white"
                    description="alert"
                  />
                  <p className="text-sm font-light text-black/85">
                    Disclaimer: Some layers and widgets are not available for certain locations.
                    Select applicable geography to enable layer.
                  </p>
                </div>
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

          <Helper
            className={{
              button: '-top-1.5 right-0 z-20',
              tooltip: 'max-w-[400px]',
            }}
            tooltipPosition={{ top: -50, left: -10 }}
            message="Expand or collapse all widgets"
          >
            <button
              type="button"
              data-testid="expand-collapse-button"
              className={cn({
                'h-8 w-full rounded-4xl bg-white px-4 py-1 font-sans text-sm font-semibold text-brand-800 shadow-control transition-colors disabled:text-opacity-60 md:ml-0 md:w-[262px]':
                  true,
                'bg-white': widgetsCollapsedChecker,
                'print:hidden': screenWidth >= breakpoints.md,
              })}
              disabled={widgets.length <= 1}
              onClick={handleWidgetsCollapsed}
            >
              {widgetsCollapsedChecker ? 'Expand all widgets' : 'Collapse all widgets'}
            </button>
          </Helper>
        </div>
      </div>

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
          message="Triggers deck to configure widgets"
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
              message="Widgets display information and statistics about a geometry on the map. Most widgets also come with map layer that can be toggled on or off"
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

      {!!widgets.length && (uploadedGeojson || customGeojson) ? (
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
