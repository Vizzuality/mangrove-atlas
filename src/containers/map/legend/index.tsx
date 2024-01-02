import { useCallback, useState } from 'react';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { activeGuideAtom } from 'store/guide';
import { activeLayersAtom } from 'store/layers';
import { nationalDashboardSettingsAtom } from 'store/national-dashboard';

import { AnimatePresence, motion } from 'framer-motion';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';
import { useRecoilValue, useRecoilState } from 'recoil';

import { MAP_LEGENDS, WIDGETS } from 'containers/datasets';
import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';
import Helper from 'containers/guide/helper';
import { LAYERS } from 'containers/layers/constants';
import WidgetWrapper from 'containers/widget';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/dialog';
import Icon from 'components/icon';
import SortableList from 'components/map/legend/sortable/list';
import { Popover, PopoverContent, PopoverTrigger } from 'components/popover';
import Slider from 'components/slider';
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from 'components/tooltip';
import type { ActiveLayers } from 'types/layers';
import type { WidgetSlugType } from 'types/widget';

import CLOSE_SVG from 'svgs/legend/close-legend.svg?sprite';
import DRAG_SVG from 'svgs/legend/drag.svg?sprite';
import HIDE_SVG from 'svgs/legend/hide.svg?sprite';
import INFO_SVG from 'svgs/legend/info-legend.svg?sprite';
import OPACITY_SVG from 'svgs/legend/opacity.svg?sprite';
import SHOW_SVG from 'svgs/legend/show.svg?sprite';

const Legend = () => {
  const {
    query: { params },
  } = useRouter();

  const locationType = params?.[0] as LocationTypes;
  const id = params?.[1];
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const guideIsActive = useRecoilValue(activeGuideAtom);

  const {
    data: { id: locationId },
  } = useLocation(locationType, id);

  const [isOpen, setIsOpen] = useState(false);
  const [sortArray, setSortArray] = useState([]);

  const onChangeVisibility = useCallback(
    (layer) => {
      const layersWithVisibility: ActiveLayers[] = activeLayers.map((l) => {
        if (l.id === layer) {
          return { ...l, visibility: l.visibility === 'visible' ? 'none' : 'visible' };
        }
        return l;
      });

      setActiveLayers(layersWithVisibility);
    },
    [activeLayers, setActiveLayers]
  );

  const settings = useRecoilValue(nationalDashboardSettingsAtom);
  const nationalDashboardLayerName =
    settings && Object.values(settings).filter((s) => s.locationId === locationId)[0]?.name;

  const removeLayer = useCallback(
    (layer: string) => {
      const updatedLayers = activeLayers.filter((l) => {
        return l.id !== layer;
      });
      setActiveLayers(updatedLayers);
    },
    [activeLayers, setActiveLayers]
  );

  const layerName = (label) => {
    return LAYERS.find((w) => w.id === label)?.name;
  };

  const openLegend = useCallback(() => {
    if (!!activeLayers.length) setIsOpen(true);
  }, [activeLayers]);

  const closeLegend = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onChangeOrder = useCallback(
    (ids: string[]) => {
      setSortArray(ids);
      const sortedLayers = activeLayers.sort(
        (a, b) => sortArray.indexOf(a.id) - sortArray.indexOf(b.id)
      );
      setActiveLayers(sortedLayers);
    },
    [activeLayers, sortArray, setActiveLayers]
  );

  const onChangeOpacity = useCallback(
    (op: number, layer: string) => {
      const layersWithOpacity = activeLayers.map((l) => {
        if (l.id === layer) {
          return { ...l, opacity: op.toString() };
        }
        return l;
      });

      setActiveLayers(layersWithOpacity);
    },
    [activeLayers, setActiveLayers]
  );

  const HELPER_ID = activeLayers[0]?.id;

  const contentVariants = {
    open: { y: '-100%', opacity: 1 },
    close: { y: '10%', opacity: 0 },
  };

  return (
    <div>
      {!!activeLayers.length && (
        <>
          <button
            onClick={openLegend}
            className={cn({
              'absolute right-0 bottom-0 z-50 flex h-11 cursor-pointer items-center justify-center space-x-2 rounded-3xl border bg-white py-2 px-5 shadow-control':
                true,
              hidden: isOpen,
            })}
          >
            <p className="opacity-85 whitespace-nowrap text-xs font-bold uppercase text-black">
              Show legend
            </p>

            <FaArrowUp className="mb-1" />
          </button>

          <AnimatePresence>
            <motion.div
              initial={false}
              variants={contentVariants}
              animate={isOpen ? 'open' : 'close'}
              exit="close"
              transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
              className="fixed right-[73px]"
            >
              <div className="w-[360px] gap-4 rounded-3xl border bg-white shadow-medium animate-in duration-300 data-[state=open]:fade-in-60 data-[state=close]:slide-in-from-bottom-0 md:data-[state=open]:slide-in-from-bottom-16">
                <div className="divide-black/42 box-content flex max-h-[55vh] flex-col space-y-1 divide-y overflow-y-auto px-4 pt-4 print:hidden">
                  <SortableList onChangeOrder={onChangeOrder}>
                    {activeLayers.map((l) => {
                      const WidgetLegend = MAP_LEGENDS[l.id] as React.ElementType;

                      const Widget = WIDGETS[l.id] as React.ElementType;

                      const visibility = l.visibility === 'visible';

                      const layerNameToDisplay = layerName(l.id);
                      if (
                        layerNameToDisplay === undefined &&
                        l.id !== 'mangrove_national_dashboard_layer'
                      )
                        return null;

                      const title =
                        l.id === 'mangrove_national_dashboard_layer' && nationalDashboardLayerName
                          ? `National Dashboard: ${nationalDashboardLayerName}`
                          : layerNameToDisplay;

                      return (
                        <div
                          data-testid={`layer-legend-${l.id}`}
                          id={l.id}
                          key={l.id}
                          className="flex flex-col items-start rounded-md bg-white px-2 pb-4 pt-2 text-sm"
                        >
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Icon icon={DRAG_SVG} className="h-4 w-4" description="Order layer" />

                              <p className="text-xs font-semibold uppercase tracking-wider text-black/85">
                                {title}
                              </p>
                            </div>
                            <div className="ml-2 flex items-center">
                              <Dialog>
                                <DialogTrigger>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Helper
                                        className={{
                                          button:
                                            HELPER_ID === l.id
                                              ? '-bottom-[11px] right-0 z-20'
                                              : 'hidden',
                                          tooltip: 'w-fit-content',
                                        }}
                                        tooltipPosition={{ top: 60, left: 0 }}
                                        message="Info layer"
                                      >
                                        <Icon
                                          icon={INFO_SVG}
                                          className="mr-1.5 h-[17px] w-[17px] fill-black/40"
                                        />
                                      </Helper>
                                    </TooltipTrigger>
                                    <TooltipPortal>
                                      <TooltipContent
                                        side="top"
                                        align="center"
                                        className={cn({
                                          'bg-gray-600 px-2 text-white': true,
                                          hidden: guideIsActive,
                                        })}
                                      >
                                        Info layer
                                      </TooltipContent>
                                    </TooltipPortal>
                                  </Tooltip>
                                </DialogTrigger>

                                <DialogContent
                                  className={cn({
                                    'scroll-y mt-10 rounded-3xl !shadow-widget': true,
                                    hidden: guideIsActive,
                                  })}
                                  overlay={false}
                                >
                                  <div className="no-scrollbar overflow-y-auto px-3">
                                    <WidgetWrapper
                                      key={l.id}
                                      title={title}
                                      id={l.id as WidgetSlugType}
                                      info
                                    >
                                      <Widget id={l.id} />
                                    </WidgetWrapper>
                                  </div>
                                  <DialogClose />
                                </DialogContent>
                              </Dialog>
                              <Popover>
                                <PopoverTrigger>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div aria-label="Opacity layer">
                                        <Helper
                                          className={{
                                            button:
                                              HELPER_ID === l.id
                                                ? '-bottom-3.5 right-0 z-20'
                                                : 'hidden',
                                            tooltip: 'w-fit-content',
                                          }}
                                          tooltipPosition={{ top: 60, left: 0 }}
                                          message="Set opacity layer"
                                        >
                                          <Icon icon={OPACITY_SVG} className="mr-0.5 h-6 w-6" />
                                        </Helper>
                                      </div>
                                    </TooltipTrigger>

                                    <TooltipPortal>
                                      <TooltipContent
                                        side="top"
                                        align="center"
                                        className={cn({
                                          'bg-gray-600 px-2 text-white': true,
                                          hidden: guideIsActive,
                                        })}
                                      >
                                        Opacity
                                      </TooltipContent>
                                    </TooltipPortal>
                                  </Tooltip>
                                </PopoverTrigger>

                                <PopoverContent
                                  sideOffset={2}
                                  side="top"
                                  align="end"
                                  className={cn({
                                    'rounded-none !shadow-md': true,
                                    hidden: guideIsActive,
                                  })}
                                >
                                  <Slider
                                    className="w-[150px] pt-2"
                                    defaultValue={[l.opacity]}
                                    onValueChange={(op: number[]) => onChangeOpacity(op[0], l.id)}
                                  />
                                </PopoverContent>
                              </Popover>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    onClick={() => !guideIsActive && onChangeVisibility(l.id)}
                                    aria-label="Visibility layer"
                                  >
                                    <Helper
                                      className={{
                                        button:
                                          HELPER_ID === l.id
                                            ? '-bottom-3.5 -right-1 z-20'
                                            : 'hidden',
                                        tooltip: 'w-fit-content',
                                      }}
                                      tooltipPosition={{ top: 60, left: 0 }}
                                      message="Hide/show layer"
                                    >
                                      <Icon
                                        icon={visibility ? HIDE_SVG : SHOW_SVG}
                                        className={cn({
                                          'mx-px !fill-black/40': true,
                                          'h-6 w-6': visibility,
                                          'h-5 w-6': !visibility,
                                        })}
                                      />
                                    </Helper>
                                  </button>
                                </TooltipTrigger>

                                {!guideIsActive && (
                                  <TooltipPortal>
                                    <TooltipContent
                                      side="top"
                                      align="center"
                                      className="bg-gray-600 px-2 text-white"
                                    >
                                      {visibility ? 'Hide' : 'Show'}
                                    </TooltipContent>
                                  </TooltipPortal>
                                )}
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    onClick={() => !guideIsActive && removeLayer(l.id)}
                                    aria-label="Remove layer"
                                  >
                                    <Helper
                                      className={{
                                        button:
                                          HELPER_ID === l.id ? '-bottom-3 -right-1 z-20' : 'hidden',
                                        tooltip: 'w-fit-content',
                                      }}
                                      tooltipPosition={{ top: 60, left: 0 }}
                                      message="Remove layer"
                                    >
                                      <Icon icon={CLOSE_SVG} className="ml-0.5 h-5 w-5 stroke-2" />
                                    </Helper>
                                  </button>
                                </TooltipTrigger>
                                <TooltipPortal>
                                  <TooltipContent
                                    side="top"
                                    align="center"
                                    className={cn({
                                      'bg-gray-600 px-2 text-white': true,
                                      hidden: guideIsActive,
                                    })}
                                  >
                                    Remove layer
                                  </TooltipContent>
                                </TooltipPortal>
                              </Tooltip>
                            </div>
                          </div>
                          {WidgetLegend && (
                            <div className="pt-4 pl-6">
                              <WidgetLegend />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </SortableList>
                </div>
                <button
                  onClick={closeLegend}
                  className="absolute -top-[30px] right-5 z-50 rounded-t-3xl bg-white p-2"
                >
                  <FaArrowDown />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default Legend;
