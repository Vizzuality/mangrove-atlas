import cn from '@/lib/classnames';

import { useSyncActiveLayers } from '@/store/layers';
import { mapViewAtom } from '@/store/sidebar';

import { useAtom } from 'jotai';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import CLOSE_SVG from '@/svgs/ui/close';

const MapToggle = () => {
  const [activeLayers] = useSyncActiveLayers();
  const [mapView, setMapView] = useAtom(mapViewAtom);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={mapView ? 'Close map' : 'Open map'}
          onClick={() => setMapView(!mapView)}
          className="flex w-14 cursor-pointer flex-col items-center justify-center space-y-1 text-white transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none"
        >
          <span
            className={cn({
              'box-border flex h-8 w-8 items-center justify-center rounded-full border-2 border-white':
                true,
              'bg-white': mapView,
            })}
          >
            {mapView && <CLOSE_SVG className="text-brand-800 h-4 w-4" role="img" title="Close" />}
            {!mapView && (
              <span className="font-sans text-sm text-white">{activeLayers?.length}</span>
            )}
          </span>
          <span className="text-xxs font-sans leading-none text-white">Map</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">{mapView ? 'Close map' : 'Open map'}</TooltipContent>
    </Tooltip>
  );
};

export default MapToggle;
