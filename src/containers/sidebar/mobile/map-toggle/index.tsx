import React from 'react';

import cn from 'lib/classnames';

import { mapViewAtom } from 'store/sidebar';
import { activeWidgetsAtom } from 'store/widgets';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import Icon from 'components/icon';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite';

const MapToggle = () => {
  const mapView = useRecoilValue(mapViewAtom);
  const setMapView = useSetRecoilState(mapViewAtom);
  const activeWidgets = useRecoilValue(activeWidgetsAtom);

  return (
    <div className="flex flex-col items-center">
      <button
        className={cn({
          'mt-1 box-border flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white':
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
