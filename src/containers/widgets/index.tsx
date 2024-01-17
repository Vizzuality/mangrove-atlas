import { useCallback, useMemo } from 'react';

import cn from 'lib/classnames';

import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';
import { mapSettingsAtom } from 'store/map-settings';
import { printModeState } from 'store/print-mode';
import { locationToolAtom } from 'store/sidebar';
import { widgetsCollapsedAtom } from 'store/widgets';
import { activeWidgetsAtom } from 'store/widgets';

import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { useWindowSize } from 'usehooks-ts';

import WidgetsLayout from 'layouts/widgets';

import Category from 'containers/categories-menu';
import { WIDGETS } from 'containers/datasets';
import Helper from 'containers/guide/helper';
import AppTools from 'containers/navigation';
import WidgetWrapper from 'containers/widget';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/dialog';
import { breakpoints } from 'styles/styles.config';
import { BUTTON_STYLES } from 'styles/widgets';

import { useWidgets } from './hooks';
import WidgetsMenu from './widgets-menu';

const HELPER_ID = 'menu-categories';

const WidgetsContainer: React.FC = () => {
  const { width: screenWidth } = useWindowSize();
  const activeWidgets = useRecoilValue(activeWidgetsAtom);
  const widgetsAvailable = useWidgets();

  const widgets = !!activeWidgets.length ? widgetsAvailable : widgetsAvailable;

  const setPrintingMode = useSetRecoilState(printModeState);

  const { enabled: drawingToolEnabled } = useRecoilValue(drawingToolAtom);
  const { enabled: drawingUploadToolEnabled } = useRecoilValue(drawingUploadToolAtom);

  const mapSettings = useRecoilValue(mapSettingsAtom);
  const locationTool = useRecoilValue(locationToolAtom);

  const [widgetsCollapsed, setWidgetsCollapsed] = useRecoilState(widgetsCollapsedAtom);

  const lastWidgetSlug = useMemo(() => !!widgets.length && widgets.at(-1).slug, [widgets]);

  const widgetsCollapsedChecker = Object.values(widgetsCollapsed)?.includes(true);

  const handleWidgetsCollapsed = useCallback(() => {
    const updateWidgetsCollapsed = Object.keys(widgetsCollapsed).reduce((acc, key) => {
      acc[key] = widgetsCollapsedChecker ? false : true;
      return acc;
    }, {});

    updateWidgetsCollapsed[lastWidgetSlug] = false;
    updateWidgetsCollapsed['mangrove_drawing_tool'] = false;
    updateWidgetsCollapsed['mangrove_drawing_upload_tool'] = false;

    setWidgetsCollapsed(updateWidgetsCollapsed);
  }, [widgetsCollapsed, widgetsCollapsedChecker, setWidgetsCollapsed]);

  const expandedWidgets = Object.keys(widgetsCollapsed).reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {});

  const onClickDownload = useCallback(() => {
    setWidgetsCollapsed(expandedWidgets);
    setPrintingMode(true);
    setTimeout(() => {
      window.print();
    }, 2000);
    setTimeout(() => {
      setPrintingMode(false);
    }, 4000);
  }, [expandedWidgets, setPrintingMode, setWidgetsCollapsed]);

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
                'h-8 w-[262px] rounded-4xl bg-white px-4 py-1 font-sans text-sm font-semibold text-brand-800 shadow-control transition-colors disabled:text-opacity-60 md:ml-0':
                  true,
                'bg-white': widgetsCollapsedChecker,
                'print:hidden': screenWidth >= breakpoints.md,
              })}
              disabled={widgets.length <= 1}
              onClick={() => handleWidgetsCollapsed()}
            >
              {widgetsCollapsedChecker ? 'Expand all widgets' : 'Collapse all widgets'}
            </button>
          </Helper>

          <Dialog>
            <Helper
              className={{
                button: 'right-0 -top-1.5 z-20',
                tooltip: 'w-fit-content',
              }}
              tooltipPosition={{ top: -50, left: 0 }}
              message="Triggers deck to configure widgets"
            >
              <DialogTrigger className="md:translate-x-0">
                <button
                  type="button"
                  data-testid="configure-widgets-button"
                  className={cn({
                    'flex h-8 w-[262px] items-center justify-center rounded-4xl bg-white py-1 px-10 font-sans text-sm font-semibold text-brand-800 shadow-control transition-colors print:hidden md:ml-0':
                      true,
                  })}
                >
                  <p>Configure widgets</p>
                </button>
              </DialogTrigger>
            </Helper>
            <DialogContent className="scroll-y min-h-fit ">
              <DialogClose />
              <div className="no-scrollbar max-h-[80vh] space-y-8 overflow-y-auto">
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
                  <div className="w-[490px]">
                    <Category />
                  </div>
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
        </div>
      </div>

      {screenWidth > 0 && screenWidth < breakpoints.md && !!widgets.length && (
        <div className="pb-16 md:pb-0">
          {widgets.map(({ slug, name, applicability }, index) => {
            const Widget = WIDGETS[slug];
            return (
              <WidgetWrapper key={slug} title={name} id={slug} applicability={applicability}>
                {WIDGETS[slug] && <Widget index={index} />}
              </WidgetWrapper>
            );
          })}
        </div>
      )}

      {screenWidth > 0 && screenWidth >= breakpoints.md && (
        <div className="print:m-auto print:grid print:w-screen print:grid-cols-2 print:pr-24">
          {widgets.map(({ slug, name, applicability }) => {
            const Widget = WIDGETS[slug];
            return (
              <WidgetWrapper
                key={slug}
                title={name}
                id={slug}
                applicability={applicability}
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
      {!!widgets.length && !mapSettings ? (
        <div className="flex w-full justify-center py-4 print:hidden">
          <Helper
            className={{
              button:
                locationTool === 'upload' || locationTool === 'area'
                  ? 'hidden'
                  : '-bottom-2.5 -right-0',
              tooltip: 'w-fit-content',
            }}
            tooltipPosition={{ top: 100, left: 10 }}
            message="use this button to download the current map view and associated widgets as a pdf file"
          >
            <div>
              <button
                className={cn({
                  [BUTTON_STYLES]: true,
                  'm-auto bg-brand-800 text-white': true,
                  hidden: drawingToolEnabled || drawingUploadToolEnabled,
                })}
                disabled={drawingToolEnabled || drawingUploadToolEnabled}
                onClick={onClickDownload}
              >
                Download report as PDF
              </button>
            </div>
          </Helper>
        </div>
      ) : null}
    </WidgetsLayout>
  );
};

export default WidgetsContainer;
