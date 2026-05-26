import { useCallback } from 'react';

import dynamic from 'next/dynamic';

import { trackEvent } from '@/lib/analytics/ga';
import cn from '@/lib/classnames';

import { activeGuideAtom } from '@/store/guide';
import { useSyncActiveLayers } from '@/store/layers';

import chroma from 'chroma-js';
import { useAtomValue } from 'jotai';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Slider from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from '@/components/ui/tooltip';
import type { Layer } from 'types/layers';

import CLOSE_SVG from '@/svgs/legend/close-legend';
import DRAG_SVG from '@/svgs/legend/drag';
import HIDE_SVG from '@/svgs/legend/hide';
import OPACITY_SVG from '@/svgs/legend/opacity';
import SHOW_SVG from '@/svgs/legend/show';

import { COLORS } from './constants';

const NATIONAL_LAYER_PREFIX = 'mangrove_national_dashboard_layer_';

// Dynamic import breaks a circular-import chain through the datasets barrel
// that the static-import bundler graph could not resolve cleanly.
const SortableList = dynamic(() => import('@/components/map/legend/sortable/list'), {
  ssr: false,
});

const iconBtn =
  'inline-flex h-7.5 w-7.5 items-center justify-center rounded-full text-black/42 hover:bg-black/5';

type SourceRowProps = {
  id: string;
  layer: Layer;
  color: string;
  name: string;
};

const SourceRow = ({ layer, color, name }: SourceRowProps) => {
  const [, setActiveLayers] = useSyncActiveLayers();
  const guideIsActive = useAtomValue(activeGuideAtom);
  const isVisible = layer.visibility === 'visible';

  const toggleVisibility = useCallback(() => {
    const nextVisibility = isVisible ? 'none' : 'visible';
    trackEvent('Legend - Layer visibility', {
      category: 'Layers - legend',
      action: 'click',
      label: `Legend - ${nextVisibility === 'visible' ? 'enable' : 'disable'} layer visibility`,
    });
    setActiveLayers((prev) =>
      (prev ?? []).map((l) => (l.id === layer.id ? { ...l, visibility: nextVisibility } : l))
    );
  }, [isVisible, layer.id, setActiveLayers]);

  const removeLayer = useCallback(() => {
    trackEvent('Legend - Remove layer', {
      category: 'Layers - legend',
      action: 'Click',
      label: `Legend - remove layer ${layer.id}`,
    });
    setActiveLayers((prev) => (prev ?? []).filter((l) => l.id !== layer.id));
  }, [layer.id, setActiveLayers]);

  const changeOpacity = useCallback(
    (op: number) => {
      setActiveLayers((prev) => {
        const target = prev?.find((l) => l.id === layer.id);
        if (!target) return prev;
        trackEvent('Legend - Change opacity', {
          category: 'Layers - legend',
          action: 'Slider',
          label: `Legend - change opacity ${layer.id} from ${target.opacity} to ${op}`,
          value: op,
        });
        return (prev ?? []).map((l) => (l.id === layer.id ? { ...l, opacity: op.toString() } : l));
      });
    },
    [layer.id, setActiveLayers]
  );

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <button
        type="button"
        aria-label={`Reorder source ${name}`}
        className="flex shrink-0 cursor-grab items-center justify-center text-black/42"
      >
        <DRAG_SVG role="img" aria-hidden={true} />
      </button>
      <div className="flex min-w-0 flex-1 items-start">
        <div
          style={{ backgroundColor: color }}
          className="my-0.5 mr-2.5 h-4 w-2 shrink-0 rounded-md text-sm"
          aria-hidden="true"
        />
        <p className="truncate text-sm">{name}</p>
      </div>

      <div className="ml-auto flex items-center justify-end gap-x-0.5">
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
              defaultValue={[parseFloat(layer.opacity)]}
              onValueChange={(op: number[]) => changeOpacity(op[0])}
            />
          </PopoverContent>
        </Popover>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? 'Hide layer' : 'Show layer'}
              className={iconBtn}
            >
              {isVisible ? (
                <SHOW_SVG aria-hidden="true" className="h-7 w-7" />
              ) : (
                <HIDE_SVG aria-hidden="true" className="h-7 w-7" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent className="bg-gray-600 px-2 text-white">
              {isVisible ? 'Hide' : 'Show'}
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={removeLayer}
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
    </div>
  );
};

const NationalDashboardMapLegend = () => {
  const [activeLayers, setActiveLayers] = useSyncActiveLayers();

  const nationalLayers = (activeLayers ?? []).filter(
    (layer) => typeof layer.id === 'string' && layer.id.startsWith(NATIONAL_LAYER_PREFIX)
  );

  const handleChangeOrder = useCallback(
    (order: string[]) => {
      setActiveLayers((prev) => {
        const current = prev ?? [];
        const byId = new Map<string, Layer>(current.map((l) => [l.id as string, l]));
        let cursor = 0;
        return current.map((l) => {
          if (!l.id.startsWith(NATIONAL_LAYER_PREFIX)) return l;
          const nextId = order[cursor++];
          return byId.get(nextId) ?? l;
        });
      });
    },
    [setActiveLayers]
  );

  if (nationalLayers.length === 0) return null;

  const maxIndex = nationalLayers.reduce(
    (max, l) => Math.max(max, (l.settings?.layerIndex as number) ?? 0),
    0
  );
  const palette = chroma.scale(COLORS).colors(Math.max(maxIndex + 1, COLORS.length));

  return (
    <div className="w-full space-y-2 font-sans text-black/60">
      <SortableList
        onChangeOrder={handleChangeOrder}
        sortable={{ handle: true, enabled: nationalLayers.length > 1 }}
        divided={false}
      >
        {nationalLayers.map((layer) => {
          const layerIndex = (layer.settings?.layerIndex as number) ?? 0;
          const color = palette[layerIndex] ?? palette[0];
          const name = (layer.settings?.name as string) ?? '';
          return (
            <SourceRow
              id={layer.id as string}
              key={layer.id}
              layer={layer as Layer}
              color={color}
              name={name}
            />
          );
        })}
      </SortableList>
    </div>
  );
};

export default NationalDashboardMapLegend;
