import { MouseEvent, useCallback } from 'react';

import { useMap } from 'react-map-gl';

import cn from '@/lib/classnames';

import { MAP_DEFAULT_PROPS } from '@/containers/map';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import ZOOM_IN_SVG from '@/svgs/map/zoom-in';
import ZOOM_OUT_SVG from '@/svgs/map/zoom-out';

const COMMON_CLASSES =
  'bg-white group w-full w-12 p-4 hover:bg-gray-100 active:outline active:outline-2 active:-outline-offset-[5px] active:outline-brand-400/40 disabled:bg-gray-50 disabled:outline-none hover:gray-100';

const SVG_COMMON_CLASSES = 'h-4 w-4 group-disabled:fill-grey-75';

export const ZoomControl = ({ className, mapId }: { className?: string; mapId: string }) => {
  const { [mapId]: map } = useMap();
  const zoom = map?.getZoom() || MAP_DEFAULT_PROPS.initialViewState.zoom;
  const minZoom = map?.getMinZoom() || MAP_DEFAULT_PROPS.minZoom;

  const maxZoom = map?.getMaxZoom() || MAP_DEFAULT_PROPS.maxZoom;

  const increaseZoom = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (!map) return null;

      map.zoomIn();
    },
    [map]
  );

  const decreaseZoom = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (!map) return null;
      map.zoomOut();
    },
    [map]
  );

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className={cn(className, { 'flex flex-col': true })}>
          <button
            className={cn({
              [COMMON_CLASSES]: true,
            })}
            aria-label="Zoom in"
            type="button"
            disabled={zoom >= maxZoom}
            onClick={increaseZoom}
          >
            <ZOOM_IN_SVG
              className={`fill-current ${SVG_COMMON_CLASSES}`}
              role="img"
              title="Zoom-in"
            />
          </button>
          <button
            className={cn({
              [COMMON_CLASSES]: true,
            })}
            aria-label="Zoom out"
            type="button"
            disabled={zoom <= minZoom}
            onClick={decreaseZoom}
          >
            <ZOOM_OUT_SVG
              className={`fill-current ${SVG_COMMON_CLASSES}`}
              role="img"
              title="Zoom-out"
            />
          </button>
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-gray-600 px-2 text-white">Zoom control</TooltipContent>
    </Tooltip>
  );
};

export default ZoomControl;
