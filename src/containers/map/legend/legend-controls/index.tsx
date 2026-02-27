import { useCallback, useState } from 'react';

import { trackEvent } from '@/lib/analytics/ga';
import cn from '@/lib/classnames';

import { activeGuideAtom } from '@/store/guide';
import { activeLayersAtom } from '@/store/layers';

import { DialogTitle } from '@radix-ui/react-dialog';
import { useRecoilState, useRecoilValue } from 'recoil';

import { INFO, MAP_LEGENDS } from '@/containers/datasets';
import { LAYERS } from '@/containers/layers/constants';

import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Slider from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from '@/components/ui/tooltip';
import type { ActiveLayers } from 'types/layers';

import CLOSE_SVG from '@/svgs/legend/close-legend';
import HIDE_SVG from '@/svgs/legend/hide';
import INFO_SVG from '@/svgs/ui/info';
import OPACITY_SVG from '@/svgs/legend/opacity';
import SHOW_SVG from '@/svgs/legend/show';

const LegendControls = ({ l }: { id: string; embedded?: boolean; l: ActiveLayers }) => {
  const [infoDialogVisibility, setInfoDialogVisibility] = useState(false);
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const guideIsActive = useRecoilValue(activeGuideAtom);

  const onChangeVisibility = useCallback(
    (layer) => {
      const layersWithVisibility: ActiveLayers[] = activeLayers?.map((l) => {
        if (l.id === layer) {
          const visibility = l.visibility === 'visible' ? 'none' : 'visible';
          return { ...l, visibility };
        }
        if (l.id === 'custom-area') {
          return null;
        }
        return l;
      });

      // Google Analytics tracking
      trackEvent(`Legend - Layer visibility`, {
        category: 'Layers - legend',
        action: 'click',
        label: `Legend - ${l.visibility === 'none' ? 'enable' : 'disable'} layer visibility`,
      });

      setActiveLayers(layersWithVisibility);
    },
    [activeLayers, setActiveLayers]
  );

  const nationalDashboardLayerName = activeLayers?.find((l) =>
    l.id?.includes('mangrove_national_dashboard_layer')
  )?.settings?.name;

  const removeLayer = useCallback(
    (layer: string) => {
      const updatedLayers = activeLayers?.filter((l) => {
        return l.id !== layer;
      });

      // Google Analytics tracking
      trackEvent(`Legend - Remove layer`, {
        category: 'Layers - legend',
        action: 'Click',
        label: `Legend - remove layer ${layer}`,
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
      const layersWithOpacity = activeLayers?.map((l) => {
        if (l.id === layer) {
          return { ...l, opacity: op.toString() };
        }
        return l;
      });

      // Google Analytics tracking
      trackEvent(`Legend - Change opacity`, {
        category: 'Layers - legend',
        action: 'Slider',
        label: `Legend - change opacity ${layer} from ${l.opacity} to ${op}`,
        value: op,
      });

      setActiveLayers(layersWithOpacity);
    },
    [activeLayers, setActiveLayers]
  );

  const layerId = Object.keys(MAP_LEGENDS).find(
    (k) => (l.id?.startsWith('mangrove_national_dashboard') && l.id?.includes(k)) || l.id === k
  );

  const widgetId = l.id.includes('mangrove_national_dashboard_layer')
    ? 'mangrove_national_dashboard'
    : l.id;

  const visibility = l.visibility === 'visible';

  const layerNameToDisplay = layerName(l.id);
  if (layerNameToDisplay === undefined && !l.id.includes('mangrove_national_dashboard_layer'))
    return null;

  const title =
    l.id.includes('mangrove_national_dashboard_layer') && nationalDashboardLayerName
      ? `National Dashboard`
      : layerNameToDisplay;

  const WidgetInfo = INFO[widgetId] as React.ElementType;

  if (l.id === 'custom-area') return null;

  const iconBtn =
    'inline-flex h-7.5 w-7.5 items-center justify-center rounded-full text-black/42 hover:bg-black/5';
  const iconSvg = 'h-6 w-6';
  return (
    <div className="ml-2 flex items-center gap-x-0.5">
      {WidgetInfo && (
        <Dialog open={infoDialogVisibility}>
          <DialogTrigger asChild>
            <Tooltip>
              <TooltipTrigger
                asChild
                onClick={() => setInfoDialogVisibility(!infoDialogVisibility)}
              >
                <button
                  type="button"
                  aria-label="Layer info"
                  className="mr-1 flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] border-black/42 text-black/42"
                >
                  <INFO_SVG
                    className="h-3 w-3 fill-current"
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
            <DialogClose
              className="top-8 md:fixed md:top-18! md:left-[595px]"
              onClose={() => setInfoDialogVisibility(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <button type="button" aria-label="Layer opacity" className={iconBtn}>
                <OPACITY_SVG aria-hidden="true" className="h-6.5 w-6.5" />
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
            aria-label={visibility ? 'Hide layer' : 'Show layer'}
            className={iconBtn}
          >
            {visibility ? (
              <SHOW_SVG aria-hidden="true" className="h-7 w-7" />
            ) : (
              <HIDE_SVG aria-hidden="true" className="h-7 w-7" />
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
            <CLOSE_SVG role="img" aria-hidden={true} />
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
