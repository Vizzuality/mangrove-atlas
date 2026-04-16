import React from 'react';

import cn from '@/lib/classnames';

import { useSyncActiveLayers } from '@/store/layers';
import { mapViewAtom } from '@/store/sidebar';

import { useAtom } from 'jotai';

import CLOSE_SVG from '@/svgs/ui/close';

const MapToggle = () => {
  const [activeLayers] = useSyncActiveLayers();
  const [mapView, setMapView] = useAtom(mapViewAtom);

  return (
    <div className="flex h-full flex-col items-center">
      <button
        className={cn({
          'my-0.5 box-border flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white':
            true,
          'bg-white': mapView,
        })}
        onClick={() => setMapView(!mapView)}
      >
        {mapView && (
          <CLOSE_SVG
            className={cn({
              'fill-brand-600 h-5 w-5 fill-current': true,
            })}
            role="img"
            title="Close"
          />
        )}
        {!mapView && <p className="font-sans text-sm text-white">{activeLayers?.length}</p>}
      </button>
      <div className="text-xxs text-center font-sans text-white">Map</div>
    </div>
  );
};

export default MapToggle;
