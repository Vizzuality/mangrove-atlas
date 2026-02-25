import { useCallback } from 'react';

import { useMap } from 'react-map-gl';

import cn from '@/lib/classnames';

import NAVIGATION_SVG from '@/svgs/map/navigation';

export const PitchReset = ({ className, mapId }: { className?: string; mapId: string }) => {
  const { [mapId]: map } = useMap();

  const pitch = map?.getPitch();

  const resetMapPitch = useCallback(() => {
    map?.resetNorthPitch();
  }, [map]);

  return (
    <div
      className={cn(className, {
        'inline-flex w-full flex-col rounded-b-full': true,
      })}
    >
      <button
        className={cn({
          'group active:outline-brand-400/40 -mt-2 rounded-b-full bg-white p-3 hover:bg-gray-100 active:outline active:outline-2 active:-outline-offset-[5px] disabled:cursor-default disabled:bg-gray-50 disabled:outline-none':
            true,
        })}
        aria-label="Reset map pitch"
        type="button"
        onClick={resetMapPitch}
        disabled={pitch === 0}
      >
        <NAVIGATION_SVG
          className="fill-current group-disabled:fill-grey-75 h-5 w-5"
          role="img"
          title="Pitch reset"
        />
      </button>
    </div>
  );
};

export default PitchReset;
