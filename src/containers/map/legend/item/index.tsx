import { useCallback } from 'react';

import cn from 'lib/classnames';

import { activeGuideAtom } from 'store/guide';
import { activeLayersAtom } from 'store/layers';

import { useRecoilValue, useRecoilState } from 'recoil';

import { MAP_LEGENDS, WIDGETS } from 'containers/datasets';
import Helper from 'containers/guide/helper';
import { LAYERS } from 'containers/layers/constants';
import WidgetWrapper from 'containers/widget';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/dialog';
import Icon from 'components/icon';
import { Media } from 'components/media-query';
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

const LegendItem = ({
  id,
  embedded = false,
  l,
}: {
  id: string;
  embedded?: boolean;
  l: ActiveLayers;
}) => {
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const guideIsActive = useRecoilValue(activeGuideAtom);

  const onChangeVisibility = useCallback(
    (layer) => {
      const layersWithVisibility: ActiveLayers[] = activeLayers.map((l) => {
        if (l.id === layer) {
          return { ...l, visibility: l.visibility === 'visible' ? 'none' : 'visible' };
        }
        if (l.id === 'custom-area') {
          return null;
        }
        return l;
      });

      setActiveLayers(layersWithVisibility);
    },
    [activeLayers, setActiveLayers]
  );

  const nationalDashboardLayerName = activeLayers.find((l) =>
    l.id.includes('mangrove_national_dashboard_layer')
  )?.settings?.name;

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

  const layerId = Object.keys(MAP_LEGENDS).find((k) => l.id.includes(k));
  const WidgetLegend = MAP_LEGENDS[layerId] as React.ElementType;

  const widgetId = l.id.includes('mangrove_national_dashboard_layer')
    ? 'mangrove_national_dashboard'
    : l.id;

  const Widget = WIDGETS[widgetId] as React.ElementType;

  const visibility = l.visibility === 'visible';

  const layerNameToDisplay = layerName(l.id);
  if (layerNameToDisplay === undefined && !l.id.includes('mangrove_national_dashboard_layer'))
    return null;

  const title =
    l.id.includes('mangrove_national_dashboard_layer') && nationalDashboardLayerName
      ? `National Dashboard`
      : layerNameToDisplay;

  if (l.id === 'custom-area') return null;

  return (
    <div
      id={id}
      className="flex flex-col items-start rounded-md bg-white pb-4 pt-2 text-sm md:px-2"
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-2">
          <Media greaterThanOrEqual="md">
            {!embedded && (
              <button>
                <Icon icon={DRAG_SVG} className="h-4 w-4" description="Order layer" />
              </button>
            )}
          </Media>
          <p className="pl-4 text-xs font-semibold uppercase tracking-wider text-black/85 md:pl-0">
            {title}
          </p>
        </div>
        {!embedded && (
          <Helper
            className={{
              button: HELPER_ID === l.id ? '-top-2 -right-3 z-20' : 'hidden',
              tooltip: 'w-80',
            }}
            tooltipPosition={{ top: -40, left: 210 }}
            message="Use the settings of each layer to obtain detailed information, manage the opacity, hide or show it or to remove it from the map."
          >
            <div className="ml-2 flex items-center">
              <Dialog>
                <DialogTrigger>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icon icon={INFO_SVG} className="mr-1.5 h-[17px] w-[17px] fill-black/40" />
                    </TooltipTrigger>
                    <TooltipPortal>
                      <TooltipContent
                        side="top"
                        align="center"
                        className="bg-gray-600 px-2 text-white"
                      >
                        Info layer
                      </TooltipContent>
                    </TooltipPortal>
                  </Tooltip>
                </DialogTrigger>

                <DialogContent
                  className={cn({
                    'h-screen w-screen md:mb-20 md:h-auto md:w-auto': true,
                    hidden: guideIsActive,
                  })}
                  overlay={false}
                >
                  <div className="no-scrollbar overflow-y-auto px-3">
                    <WidgetWrapper key={l.id} title={title} id={widgetId as WidgetSlugType} info>
                      <Widget id={widgetId} />
                    </WidgetWrapper>
                  </div>
                  <DialogClose className="top-8 md:fixed md:!top-18 md:left-[595px]" />
                </DialogContent>
              </Dialog>
              <Popover>
                <PopoverTrigger>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div aria-label="Opacity layer">
                        <Icon icon={OPACITY_SVG} className="mr-0.5 h-6 w-6" />
                      </div>
                    </TooltipTrigger>

                    <TooltipPortal>
                      <TooltipContent
                        side="top"
                        align="center"
                        className="bg-gray-600 px-2 text-white"
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
                    onClick={() => onChangeVisibility(l.id)}
                    aria-label="Visibility layer"
                  >
                    <Icon
                      icon={visibility ? HIDE_SVG : SHOW_SVG}
                      className={cn({
                        'mx-px !fill-black/40': true,
                        'h-6 w-6': visibility,
                        'h-5 w-6': !visibility,
                      })}
                    />
                  </button>
                </TooltipTrigger>

                <TooltipPortal>
                  <TooltipContent side="top" align="center" className="bg-gray-600 px-2 text-white">
                    {visibility ? 'Hide' : 'Show'}
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" onClick={() => removeLayer(l.id)} aria-label="Remove layer">
                    <Icon icon={CLOSE_SVG} className="ml-0.5 h-5 w-5 stroke-2" />
                  </button>
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent side="top" align="center" className="bg-gray-600 px-2 text-white">
                    Remove layer
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            </div>
          </Helper>
        )}
      </div>

      {WidgetLegend && (
        <div className="pt-4 pl-6">
          <WidgetLegend />
        </div>
      )}
    </div>
  );
};

export default LegendItem;