import { useCallback, useMemo, FC } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { locationToolAtom } from '@/store/sidebar';
import { useSyncActiveWidgets } from '@/store/widgets';

import { useIsFetching } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';
import { motion } from 'motion/react';
import { useWindowSize } from 'usehooks-ts';

import WidgetsLayout from '@/layouts/widgets';

import { WIDGETS } from '@/containers/datasets';
import CloseHelpGuide from '@/containers/help/close';
import Helper from '@/containers/help/helper';
import AppTools from '@/containers/navigation';
import WidgetWrapper from '@/containers/widget';
import { widgets, ANALYSIS_WIDGETS_SLUGS } from '@/containers/widgets/constants';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { breakpoints } from '@/styles/styles.config';
import { WidgetTypes } from 'types/widget';

import SETTINGS_SVG from '@/svgs/ui/settings';

import { useWidgets } from './hooks';
import WidgetsCardsControls from './widgets-cards-controls';
import WidgetsDeckContent from './widgets-deck/content';

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

const WidgetsContainer: FC = () => {
  const [{ customGeojson }] = useAtom(drawingToolAtom);

  const [{ uploadedGeojson }] = useAtom(drawingUploadToolAtom);

  const { width: screenWidth } = useWindowSize();
  const [activeWidgets] = useSyncActiveWidgets();
  const enabledWidgets = useWidgets();
  const widgetsAvailable = useMemo(() => {
    if (customGeojson || uploadedGeojson) {
      return widgets.filter(({ slug }) => ANALYSIS_WIDGETS_SLUGS.includes(slug));
    }
    return enabledWidgets.filter(
      ({ slug }) => activeWidgets?.includes(slug) || slug === 'widgets_deck_tool'
    );
  }, [activeWidgets, enabledWidgets, customGeojson, uploadedGeojson]) satisfies WidgetTypes[];

  const locationTool = useAtomValue(locationToolAtom);
  const isCustomArea = !!(customGeojson || uploadedGeojson);
  const fetchingCount = useIsFetching();
  const isPrintDisabled = isCustomArea && fetchingCount > 0;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePrintReport = useCallback(() => {
    const qs = searchParams.toString();
    const printPath = `/print-report${pathname === '/' ? '' : pathname}`;
    const url = qs ? `${printPath}?${qs}` : printPath;
    window.open(url, '_blank');
  }, [pathname, searchParams]);

  return (
    <WidgetsLayout>
      <AppTools />
      <CloseHelpGuide />

      <WidgetsCardsControls />

      {screenWidth > 0 && screenWidth < breakpoints.md && !!widgets.length && (
        <div className="pb-16 md:pb-0">
          {widgetsAvailable.map(({ slug, name, index, ...props }) => {
            const Widget = WIDGETS[slug] satisfies () => JSX.Element;
            return (
              <WidgetWrapper
                key={slug}
                title={name}
                id={slug}
                applicability={props?.applicability}
                index={index}
              >
                {WIDGETS[slug] && <Widget />}
              </WidgetWrapper>
            );
          })}
        </div>
      )}

      {screenWidth > 0 && screenWidth >= breakpoints.md && (
        <div data-testid="widgets-wrapper">
          {widgetsAvailable.map(({ slug, name, ...props }) => {
            const Widget = WIDGETS[slug];
            return (
              <WidgetWrapper
                key={slug}
                title={name}
                id={slug}
                applicability={props?.applicability}
                contextualLayers={props?.contextualLayers}
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
            button: '-top-1.5 right-0 z-20',
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
              className="fixed bottom-3 left-[calc((560px-48px)/2)] z-20"
            >
              <motion.button
                className="bg-brand-800 shadow-control flex min-w-[48px] items-center space-x-4 rounded-full p-4 text-xs font-semibold text-white"
                variants={buttonMotion}
              >
                <SETTINGS_SVG
                  className="h-4 w-4 shrink-0 fill-current"
                  role="img"
                  aria-hidden={true}
                />
                <motion.span variants={textMotion} className="whitespace-nowrap">
                  Widgets deck
                </motion.span>
              </motion.button>
            </motion.div>
          </DialogTrigger>
        </Helper>
        <WidgetsDeckContent />
      </Dialog>
      {!!widgetsAvailable.length && (
        <div className="flex w-full justify-center py-4">
          <Helper
            className={{
              button:
                locationTool === 'upload' || locationTool === 'area'
                  ? 'hidden'
                  : 'right-0 -bottom-2.5',
              tooltip: 'w-fit-content',
            }}
            tooltipPosition={{ top: 50, left: 10 }}
            message="Use this button to open the current map view and associated widgets as a printable PDF report."
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <button
                    type="button"
                    className="bg-brand-800 hover:bg-brand-800/90 rounded-3xl px-6 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={handlePrintReport}
                    disabled={isPrintDisabled}
                  >
                    Print PDF report
                  </button>
                </span>
              </TooltipTrigger>
              {isPrintDisabled && <TooltipContent>Loading analysis data...</TooltipContent>}
            </Tooltip>
          </Helper>
        </div>
      )}
    </WidgetsLayout>
  );
};

export default WidgetsContainer;
