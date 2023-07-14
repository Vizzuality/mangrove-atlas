import { useCallback, useEffect, useMemo, useState } from 'react';

import cn from 'lib/classnames';

import { drawingToolAtom } from 'store/drawing-tool';
import { mapSettingsAtom } from 'store/map-settings';
import { printModeState } from 'store/print-mode';
import { widgetsCollapsedAtom } from 'store/widgets';

import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { useLocalStorage, useWindowSize } from 'usehooks-ts';

import WidgetsLayout from 'layouts/widgets';

import Blog from 'containers/blog';
import { WIDGETS } from 'containers/datasets';
import Helper from 'containers/guide/helper';
import WidgetWrapper from 'containers/widget';
import NoData from 'containers/widgets/no-data';

import { breakpoints } from 'styles/styles.config';
import { BUTTON_STYLES } from 'styles/widgets';

import { useWidgets } from './hooks';

const LOCAL_STORAGE_KEY = 'mangroves_blog';

const WidgetsContainer: React.FC = () => {
  const { width: screenWidth } = useWindowSize();

  const widgets = useWidgets();
  const setPrintingMode = useSetRecoilState(printModeState);
  const { showWidget, customGeojson, uploadedGeojson } = useRecoilValue(drawingToolAtom);
  const mapSettings = useRecoilValue(mapSettingsAtom);
  const [blogStorage, setBlogStorage] = useLocalStorage(LOCAL_STORAGE_KEY, undefined);
  const [isBlogActive, setBlogActive] = useState(false);

  const closeBlogBanner = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      setBlogStorage(String(false));
      setBlogActive(false);
    },
    [setBlogStorage]
  );

  useEffect(() => {
    if (!blogStorage) {
      setBlogActive(true);
    }
  }, [blogStorage, setBlogActive]);

  const [widgetsCollapsed, setWidgetsCollapsed] = useRecoilState(widgetsCollapsedAtom);

  const lastWidgetSlug = useMemo(() => widgets.at(-1).slug, [widgets]);

  const widgetsCollapsedChecker = Object.values(widgetsCollapsed).includes(true);

  const handleWidgetsCollapsed = useCallback(() => {
    const updateWidgetsCollapsed = Object.keys(widgetsCollapsed).reduce((acc, key) => {
      acc[key] = widgetsCollapsedChecker ? false : true;
      return acc;
    }, {});

    updateWidgetsCollapsed[lastWidgetSlug] = false;
    updateWidgetsCollapsed['mangrove_drawing_tool'] = false;

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
      {widgets.length > 1 && (
        <div className="flex w-full py-4 print:hidden">
          <Helper
            className={{
              button: '-bottom-2.5 -right-[170px] z-[20]',
              tooltip: 'w-fit-content',
            }}
            tooltipPosition={{ top: -50, left: -160 }}
            message="Expand or collapse all widgets"
          >
            <button
              className={cn({
                'mb-10 ml-[3%] w-48 rounded-4xl border-2 border-black border-opacity-20 py-2 px-4 font-sans text-sm font-semibold text-black/85 transition-colors md:ml-0 md:translate-x-44':
                  true,
                'border-white bg-white text-brand-800': widgetsCollapsedChecker,
                'print:hidden': screenWidth >= breakpoints.md,
              })}
              onClick={() => handleWidgetsCollapsed()}
            >
              {widgetsCollapsedChecker ? 'Expand all widgets' : 'Collapse all widgets'}
            </button>
          </Helper>
        </div>
      )}
      {/* {isBlogActive && <Blog closeBlogBanner={closeBlogBanner} />} TO-DO back when client approves it */}

      {screenWidth < breakpoints.md && (
        <div>
          {widgets.map(({ slug, name, applicability }) => {
            const Widget = WIDGETS[slug];
            return (
              <WidgetWrapper key={slug} title={name} id={slug} applicability={applicability}>
                {WIDGETS[slug] && <Widget />}
              </WidgetWrapper>
            );
          })}
        </div>
      )}

      {screenWidth >= breakpoints.md && (
        <div className="print:m-auto print:grid print:w-screen print:grid-cols-2 print:gap-1">
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

      {widgets.length === 0 && <NoData />}

      {!!widgets.length && !mapSettings ? (
        <div className="flex w-full justify-center py-4 print:hidden">
          <Helper
            className={{
              button: '-bottom-2.5 -right-0',
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
                  hidden: showWidget && !customGeojson && !uploadedGeojson,
                })}
                disabled={showWidget && !customGeojson && !uploadedGeojson}
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
