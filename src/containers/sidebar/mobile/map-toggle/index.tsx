import React from 'react';

import cn from 'lib/classnames';

import { mapViewAtom } from 'store/sidebar';
import { activeWidgetsAtom } from 'store/widgets';

import { useRecoilState, useRecoilValue } from 'recoil';

import Icon from 'components/icon';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite';

const MapToggle = () => {
  const activeWidgets = useRecoilValue(activeWidgetsAtom);
  const [mapView, setMapView] = useRecoilState(mapViewAtom);

  return (
    <div className="flex flex-col items-center">
      <button
        className={cn({
          'my-0.5 box-border flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white':
            true,
          'bg-white': mapView,
        })}
        onClick={() => setMapView(!mapView)}
      >
        {mapView && (
          <Icon
            icon={CLOSE_SVG}
            className={cn({
              'h-5 w-5 fill-brand-800': true,
            })}
          />
        )}
        {!mapView && <p className="font-sans text-sm text-white">{activeWidgets.length}</p>}
      </button>
      <div className="text-center font-sans text-xxs text-white">Map</div>
    </div>
  );
};

export default MapToggle;