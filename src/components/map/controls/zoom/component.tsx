import { useCallback, MouseEvent } from 'react';

import { useMap } from 'react-map-gl';

import cn from 'lib/classnames';

import Icon from 'components/icon';

import ZOOM_IN_SVG from 'svgs/map/zoom-in.svg?sprite';
import ZOOM_OUT_SVG from 'svgs/map/zoom-out.svg?sprite';

const COMMON_CLASSES =
  'group bg-white p-3 hover:bg-gray-100 active:outline active:outline-2 active:-outline-offset-[5px] active:outline-brand-400/40 disabled:bg-gray-50 disabled:outline-none';

const SVG_COMMON_CLASSES = 'h-5 w-5 group-disabled:fill-grey-75';

export const ZoomControl = ({ className }: { className?: string }) => {
  const { default: map } = useMap();
  const zoom = map?.getZoom();
  const minZoom = map?.getMinZoom();
  const maxZoom = map?.getMaxZoom();

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
    <div
      className={cn({
        'inline-flex flex-col rounded-md shadow-md shadow-black/10': true,
        [className]: !!className,
      })}
    >
      <button
        className={cn({
          [COMMON_CLASSES]: true,
          'rounded-t-md': true,
        })}
        aria-label="Zoom in"
        type="button"
        disabled={zoom >= maxZoom}
        onClick={increaseZoom}
      >
        <Icon icon={ZOOM_IN_SVG} className={SVG_COMMON_CLASSES} />
      </button>
      <button
        className={cn({
          [COMMON_CLASSES]: true,
          'rounded-b-md': true,
        })}
        aria-label="Zoom out"
        type="button"
        disabled={zoom <= minZoom}
        onClick={decreaseZoom}
      >
        <Icon icon={ZOOM_OUT_SVG} className={SVG_COMMON_CLASSES} />
      </button>
    </div>
  );
};

export default ZoomControl;
