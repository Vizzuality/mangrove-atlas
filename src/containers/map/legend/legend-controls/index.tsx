import { useCallback, useState } from 'react';

import { trackEvent } from '@/lib/analytics/ga';
import cn from '@/lib/classnames';

import { activeGuideAtom } from '@/store/guide';
import { useSyncActiveLayers } from '@/store/layers';

import { DialogTitle } from '@radix-ui/react-dialog';
import { useAtomValue } from 'jotai';

import { INFO } from '@/containers/datasets';
import { LAYERS } from '@/containers/layers/constants';

import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Slider from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from '@/components/ui/tooltip';
import type { Layer } from 'types/layers';

import CLOSE_SVG from '@/svgs/legend/close-legend';
import HIDE_SVG from '@/svgs/legend/hide';
import OPACITY_SVG from '@/svgs/legend/opacity';
import SHOW_SVG from '@/svgs/legend/show';
import INFO_SVG from '@/svgs/ui/info';

type LegendControlsProps = {
  id: string;
  embedded?: boolean;
  l: Layer;
  hideOpacity?: boolean;
  hideInfo?: boolean;
  compact?: boolean;
  // When provided, visibility and remove act on every layer id in this list
  // instead of only on `l.id`. Used for the national-dashboard parent legend
  // item which controls all of its source layers at once.
  targetLayerIds?: Layer['id'][];
};

const LegendControls = ({
  l,
  hideOpacity = false,
  hideInfo = false,
  compact = false,
  targetLayerIds,
}: LegendControlsProps) => {
  const [infoDialogVisibility, setInfoDialogVisibility] = useState(false);
  const [activeLayers, setActiveLayers] = useSyncActiveLayers();
  const guideIsActive = useAtomValue(activeGuideAtom);

  const onChangeVisibility = useCallback(
    (layerId: Layer['id']) => {
      const ids = targetLayerIds && targetLayerIds.length > 0 ? targetLayerIds : [layerId];
      const referenceLayer = activeLayers?.find((layer) => ids.includes(layer.id));

      if (!referenceLayer) return;

      // Mixed-state semantics: if anything in the group is visible, hide all;
      // otherwise show all. The button icon reflects "any visible".
      const anyVisible = activeLayers?.some(
        (layer) => ids.includes(layer.id) && layer.visibility === 'visible'
      );
      const nextVisibility = anyVisible ? 'none' : 'visible';

      const layersWithVisibility = activeLayers
        ?.map((layer) => {
          if (layer.id === 'custom-area') return null;
          if (!ids.includes(layer.id)) return layer;

          return {
            ...layer,
            visibility: nextVisibility,
          };
        })
        .filter(Boolean) as Layer[];

      trackEvent('Legend - Layer visibility', {
        category: 'Layers - legend',
        action: 'click',
        label: `Legend - ${nextVisibility === 'visible' ? 'enable' : 'disable'} layer visibility`,
      });

      setActiveLayers(layersWithVisibility);
    },
    [activeLayers, setActiveLayers, targetLayerIds]
  );

  const removeLayer = useCallback(
    (layer: string) => {
      const ids = targetLayerIds && targetLayerIds.length > 0 ? targetLayerIds : [layer];
      const updatedLayers = activeLayers?.filter((entry) => !ids.includes(entry.id));

      trackEvent(`Legend - Remove layer`, {
        category: 'Layers - legend',
        action: 'Click',
        label: `Legend - remove layer ${layer}`,
      });
      setActiveLayers(updatedLayers);
    },
    [activeLayers, setActiveLayers, targetLayerIds]
  );

  const layerName = (label) => {
    return LAYERS.find((w) => w.id === label)?.name;
  };

  const onChangeOpacity = useCallback(
    (op: number, layerId: string) => {
      setActiveLayers((prev) => {
        const targetLayer = prev?.find((l) => l.id === layerId);

        if (!targetLayer) return prev;

        trackEvent('Legend - Change opacity', {
          category: 'Layers - legend',
          action: 'Slider',
          label: `Legend - change opacity ${layerId} from ${targetLayer.opacity} to ${op}`,
          value: op,
        });

        return (prev ?? []).map((l) => (l.id === layerId ? { ...l, opacity: op.toString() } : l));
      });
    },
    [setActiveLayers]
  );

  const widgetId = l.id.includes('mangrove_national_dashboard_layer')
    ? 'mangrove_national_dashboard'
    : l.id;

  const visibility =
    targetLayerIds && targetLayerIds.length > 0
      ? (activeLayers ?? []).some(
          (layer) => targetLayerIds.includes(layer.id) && layer.visibility === 'visible'
        )
      : l.visibility === 'visible';

  const layerNameToDisplay = layerName(l.id);
  if (layerNameToDisplay === undefined && !l.id.includes('mangrove_national_dashboard_layer'))
    return null;

  const WidgetInfo = INFO[widgetId] as React.ElementType;

  if (l.id === 'custom-area') return null;

  const iconBtn = compact
    ? 'inline-flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-full text-black/42 hover:bg-black/5'
    : 'inline-flex h-7.5 w-7.5 cursor-pointer items-center justify-center rounded-full text-black/42 hover:bg-black/5';
  const opacityIconCls = compact ? 'h-4 w-4' : 'h-6.5 w-6.5';
  const showHideIconCls = compact ? 'h-5 w-5' : 'h-7 w-7';
  const closeIconCls = compact ? 'h-3 w-3' : '';
  const infoBtnCls = compact
    ? 'mr-1 flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-black/42 text-black/42'
    : 'mr-1 flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-black/42 text-black/42';
  const infoIconCls = compact ? 'h-2 w-2 fill-current' : 'h-3 w-3 fill-current';

  return (
    <div className="ml-auto flex items-center justify-end gap-x-1">
      {!hideInfo && WidgetInfo && (
        <Dialog open={infoDialogVisibility} onOpenChange={setInfoDialogVisibility}>
          <DialogTrigger asChild>
            <Tooltip>
              <TooltipTrigger
                asChild
                onClick={() => setInfoDialogVisibility(!infoDialogVisibility)}
              >
                <button type="button" aria-label="Layer info" className={infoBtnCls}>
                  <INFO_SVG
                    className={infoIconCls}
                    role="img"
                    aria-hidden={true}
                    aria-label="Info layer"
                  />
                </button>
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipContent className="bg-gray-600 px-2 text-white">Layer info</TooltipContent>
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
            <DialogTitle className="sr-only">Widget info</DialogTitle>
            <div className="no-scrollbar overflow-y-auto">
              <div className="no-scrollbar overflow-y-auto">{WidgetInfo && <WidgetInfo />}</div>
            </div>
            <DialogClose onClose={() => setInfoDialogVisibility(false)} />
          </DialogContent>
        </Dialog>
      )}

      {!hideOpacity && (
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <button type="button" aria-label="Layer opacity" className={iconBtn}>
                  <OPACITY_SVG aria-hidden="true" className={opacityIconCls} />
                </button>
              </PopoverTrigger>
            </TooltipTrigger>

            <TooltipPortal>
              <TooltipContent className="bg-gray-600 px-2 text-white">Opacity</TooltipContent>
            </TooltipPortal>
          </Tooltip>

          <PopoverContent
            sideOffset={2}
            side="top"
            align="end"
            className={cn('rounded-none shadow-md!', { hidden: guideIsActive })}
          >
            <Slider
              className="w-[150px] pt-2"
              defaultValue={[parseFloat(l.opacity)]}
              onValueChange={(op: number[]) => onChangeOpacity(op[0], l.id)}
            />
          </PopoverContent>
        </Popover>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onChangeVisibility(l.id)}
            aria-label={visibility ? 'Hide layer' : 'Show layer'}
            className={iconBtn}
          >
            {visibility ? (
              <SHOW_SVG aria-hidden="true" className={showHideIconCls} />
            ) : (
              <HIDE_SVG aria-hidden="true" className={showHideIconCls} />
            )}
          </button>
        </TooltipTrigger>

        <TooltipPortal>
          <TooltipContent
            side="top"
            align="center"
            className="rounded bg-gray-600 px-2 py-1 text-sm text-white shadow"
          >
            {visibility ? 'Hide' : 'Show'}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => removeLayer(l.id)}
            aria-label="Remove layer"
            className={iconBtn}
          >
            <CLOSE_SVG aria-hidden={true} className={closeIconCls} />
          </button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent className="bg-gray-600 px-2 text-white">Remove layer</TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </div>
  );
};

export default LegendControls;
