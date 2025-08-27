import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cn from 'lib/classnames';
import { isEmpty } from 'lodash-es';

import {
  mapDraggableTooltipPositionAtom,
  coordinatesAtom,
  mapDraggableTooltipPinnedAtom,
  mapDraggableTooltipDimensionsAtom,
} from 'store/map';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { useMap } from 'react-map-gl';
import { MapboxGeoJSONFeature } from 'mapbox-gl';

import Draggable from 'components/draggable';
import { ScrollArea } from 'components/ui/scroll-area';

// POPUPS
import type { IUCNEcoregionPopUpInfo } from 'containers/datasets/iucn-ecoregion/types';
import IucnEcoregionPopup from 'containers/datasets/iucn-ecoregion/map-popup';
import LocationPopup from 'containers/datasets/locations/map-popup';
import RestorationSitesPopup from 'containers/datasets/restoration-sites/map-pop-up';
import RestorationPopup from 'containers/datasets/restoration/map-popup';

import type { LocationPopUp, RestorationPopUp, RestorationSitesPopUp } from 'types/map';

import MapPopupDragHandler from './pop-up-controls/drag';
import MapPopupClose from './pop-up-controls/close';
import MapPopupPin from './pop-up-controls/pin';
import { set } from 'date-fns';

type Position = { x: number; y: number };

type MapPopupProps = {
  mapId: string;
  locationInfo: {
    info: LocationPopUp;
    position?: Position;
    feature: MapboxGeoJSONFeature;
  };
  restorationInfo: { info: RestorationPopUp };
  restorationsitesInfo: { info: RestorationSitesPopUp };
  iucnEcoregionInfo: { info: IUCNEcoregionPopUpInfo };
};

const MapPopup = ({
  mapId,
  locationInfo,
  restorationInfo,
  restorationsitesInfo,
  iucnEcoregionInfo,
}: MapPopupProps) => {
  const [position, setPosition] = useRecoilState(mapDraggableTooltipPositionAtom);
  const coordinates = useRecoilValue(coordinatesAtom);
  const [isPinned, setPin] = useRecoilState(mapDraggableTooltipPinnedAtom);
  const setMapDraggableTooltipDimensions = useSetRecoilState(mapDraggableTooltipDimensionsAtom);
  const [flash, setFlash] = useState(false);

  const popUpRef = useRef<HTMLDivElement>(null);

  const { [mapId]: map } = useMap();

  const handleClickToDocker = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isPinned) {
        const point = map?.project([coordinates.lng, coordinates.lat]);
        setPosition(point ?? null);
        setPin(false);
      }

      if (!isPinned) {
        setFlash(true);
        setTimeout(() => setFlash(false), 1000);
        setPosition({ x: 14, y: 16 });
        setPin(true);
      }
    },
    [map, coordinates, setPosition, setPin, isPinned]
  );

  useEffect(() => {
    if (popUpRef.current) {
      popUpRef.current.getBoundingClientRect().height;
      popUpRef.current.getBoundingClientRect().width;
      setMapDraggableTooltipDimensions((prev) => ({
        h: popUpRef.current.getBoundingClientRect().height,
        w: popUpRef.current.getBoundingClientRect().width,
      }));
    }
  }, [
    locationInfo.info,
    restorationInfo.info,
    restorationsitesInfo.info,
    iucnEcoregionInfo.info,
    popUpRef,
  ]);

  if (!locationInfo.info) return null;

  const maxHeight = useMemo(() => {
    return `calc(${window.innerHeight - position?.y - 20}px)`;
  }, [position?.y]);

  return (
    <Draggable position={position} id="draggable-map-popup" isPinned={isPinned}>
      {({ listeners, attributes }) => (
        <div
          ref={popUpRef}
          className={cn(
            'shadow-popup absolute z-50 flex flex-col rounded-3xl border bg-white transition-all duration-300',
            'w-fit-content border-gray-300',
            isPinned && 'border-2 border-brand-800 shadow-md sm:w-[532px]',
            flash && 'ring-2 ring-brand-400'
          )}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pop-up controls */}
          <div className="flex w-full items-center justify-between rounded-t-3xl hover:bg-white/90">
            <MapPopupDragHandler
              listeners={listeners}
              attributes={attributes}
              handleClickToDocker={handleClickToDocker}
            />

            <div className="mr-6 mt-3 flex items-center justify-end space-x-4">
              <MapPopupPin handleClickToDocker={handleClickToDocker} isPinned={isPinned} />
              <MapPopupClose setPosition={setPosition} />
            </div>
          </div>

          {/* Pop-up content */}
          <ScrollArea className="relative -mb-8 grow overflow-y-auto overflow-x-hidden">
            {/* Gradients */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 z-10 h-8 bg-gradient-to-b from-white to-transparent" />
            <div className="pointer-events-none absolute bottom-0 left-6 right-6 z-10 h-8 bg-gradient-to-t from-white to-transparent" />

            <div
              className="relative min-w-[375px] divide-y divide-gray-200 rounded-b-3xl bg-white"
              style={{ maxHeight }}
            >
              <LocationPopup
                locationPopUpInfo={locationInfo}
                nonExpansible={isEmpty(iucnEcoregionInfo?.info) && isEmpty(restorationInfo?.info)}
              />
              {restorationInfo?.info && <RestorationPopup {...restorationInfo} />}
              {restorationsitesInfo?.info && <RestorationSitesPopup {...restorationsitesInfo} />}
              {iucnEcoregionInfo.info && <IucnEcoregionPopup info={iucnEcoregionInfo.info} />}
            </div>
          </ScrollArea>
        </div>
      )}
    </Draggable>
  );
};

export default MapPopup;
