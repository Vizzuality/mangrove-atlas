import { useState } from 'react';

import cn from '@/lib/classnames';

import { activeGuideAtom } from '@/store/guide';
import { activeLayersAtom } from '@/store/layers';

import { DialogTitle } from '@radix-ui/react-dialog';
import { useRecoilState, useRecoilValue } from 'recoil';

import { MAP_LEGENDS, WIDGETS } from '@/containers/datasets';
import Helper from '@/containers/help/helper';
import { LAYERS } from '@/containers/layers/constants';
import WidgetWrapper from '@/containers/widget';
import { widgets } from '@/containers/widgets/constants';

import { Media } from '@/components/media-query';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from '@/components/ui/tooltip';
import type { ActiveLayers } from 'types/layers';
import type { WidgetSlugType } from 'types/widget';

import DRAG_SVG from '@/svgs/legend/drag';
import LegendControls from '../legend-controls';

const LegendItem = ({
  id,
  embedded = false,
  l,
}: {
  id: string;
  embedded?: boolean;
  l: ActiveLayers;
}) => {
  const [statisticsDialogVisibility, setStatisticsDialogVisibility] = useState(false);
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const guideIsActive = useRecoilValue(activeGuideAtom);
  const widget = widgets.find((w) => w.slug === l.id);

  const nationalDashboardLayerName = activeLayers?.find((l) =>
    l.id?.includes('mangrove_national_dashboard_layer')
  )?.settings?.name;

  const layerName = (label) => {
    return LAYERS.find((w) => w.id === label)?.name;
  };

  const HELPER_ID = activeLayers?.[0]?.id;

  const layerId = Object.keys(MAP_LEGENDS).find(
    (k) => (l.id?.startsWith('mangrove_national_dashboard') && l.id?.includes(k)) || l.id === k
  );

  const WidgetLegend = MAP_LEGENDS[layerId] as React.ElementType;

  const widgetId = l.id.includes('mangrove_national_dashboard_layer')
    ? 'mangrove_national_dashboard'
    : l.id;

  const Widget = WIDGETS[widgetId] as React.ElementType;

  const layerNameToDisplay = layerName(l.id);
  if (layerNameToDisplay === undefined && !l.id.includes('mangrove_national_dashboard_layer'))
    return null;

  const title =
    l.id.includes('mangrove_national_dashboard_layer') && nationalDashboardLayerName
      ? `National Dashboard`
      : layerNameToDisplay;

  if (l.id === 'custom-area') return null;

  return (
    <div id={id} className="flex flex-col items-start rounded-md bg-white py-4 text-sm md:px-2">
      <div className="flex w-full items-start justify-between">
        <div className="flex items-center gap-2">
          <Media greaterThanOrEqual="md">
            {!embedded && (
              <button>
                <DRAG_SVG role="img" title="Order layer" />
              </button>
            )}
          </Media>
          <Dialog open={statisticsDialogVisibility}>
            <DialogTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="Layer statistics"
                    onClick={() => setStatisticsDialogVisibility(!statisticsDialogVisibility)}
                  >
                    <p className="pl-4 text-left text-xs font-semibold tracking-wider text-black/85 uppercase md:pl-0">
                      {title}
                    </p>
                  </button>
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent className="bg-gray-600 px-2 text-white">
                    Layer statistics
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            </DialogTrigger>

            <DialogContent
              className={cn({
                'h-screen w-screen min-w-[540px] md:mb-20 md:h-auto md:w-auto': true,
                hidden: guideIsActive,
              })}
              overlay={false}
            >
              <DialogTitle className="sr-only">Layer statistics</DialogTitle>
              <div className="no-scrollbar overflow-y-autopx-3 relative">
                <WidgetWrapper
                  key={l.id}
                  title={title}
                  applicability={widget?.applicability}
                  contextualLayers={widget?.contextualLayers}
                  id={widgetId as WidgetSlugType}
                  info
                >
                  <Widget id={widgetId} />
                </WidgetWrapper>
              </div>
              <DialogClose
                className="top-8 md:fixed md:top-18! md:left-[595px]"
                onClose={() => setStatisticsDialogVisibility(false)}
              />
            </DialogContent>
          </Dialog>
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
            <LegendControls id={id} l={l} />
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
