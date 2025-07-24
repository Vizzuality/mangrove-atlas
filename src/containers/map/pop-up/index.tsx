import { useState } from 'react';

import cn from 'lib/classnames';
import { isEmpty } from 'lodash-es';

import { mapDraggableTooltipPositionAtom, coordinatesAtom } from 'store/map';
import { useRecoilState, useRecoilValue } from 'recoil';

import { useMap } from 'react-map-gl';
import { MapboxGeoJSONFeature } from 'mapbox-gl';

import Draggable from 'components/draggable';
import { ScrollArea } from 'components/ui/scroll-area';

// POPUPS
import type { IUCNEcoregionPopUpInfo } from 'containers/datasets/iucn-ecoregion/types';
import IucnEcoregionPopup from 'containers/datasets/iucn-ecoregion/map-popup';
import LocationPopup from 'containers/datasets/locations/map-popup';
import RestorationSitesPopup from 'containers/datasets/restoration-sites/map-popup';
import RestorationPopup from 'containers/datasets/restoration/map-popup';

// Icons
import { MdOutlineDragHandle } from 'react-icons/md';
import { HiX } from 'react-icons/hi';
import { LuPin, LuPinOff } from 'react-icons/lu';
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs';

import type { LocationPopUp, RestorationPopUp, RestorationSitesPopUp } from 'types/map';

type MapPopupProps = {
  mapId: string;
  locationInfo: {
    info: LocationPopUp;
    position?: { x: number; y: number };
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
  const [isPinned, setPin] = useState(false);

  const { [mapId]: map } = useMap();

  const handleClick = () => {
    setPosition(null);
  };

  const handleClickToDocker = (e) => {
    e.stopPropagation();
    setPin((prev) => {
      if (prev) {
        const point = map?.project([coordinates.lng, coordinates.lat]);

        setPosition(point);
      } else {
        setPosition({ x: 14, y: 16 });
      }
      return !prev;
    });
  };

  if (!locationInfo.info) return null;

  return (
    <Draggable position={position} id="draggable-map-popup">
      {({ listeners, attributes }) => (
        <div
          className={cn({
            'w-fit-content shadow-popup absolute z-50 flex flex-col rounded-3xl border border-gray-300 bg-white transition-all duration-300':
              true,

            'w-[532px] border-2 border-brand-800': isPinned,
          })}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle */}
          <div className="flex w-full items-center justify-between rounded-t-3xl hover:bg-white/90">
            <button
              type="button"
              className="w-full flex-1 cursor-grab"
              {...listeners}
              {...attributes}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MdOutlineDragHandle
                className="ml-6 mt-3 h-6 w-6 text-brand-800"
                onClick={handleClickToDocker}
              />
            </button>
            <div className="mr-6 mt-3 flex items-center justify-end space-x-4">
              <button
                type="button"
                className="cursor-pointer rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={handleClickToDocker}
              >
                {isPinned ? (
                  <BsPinAngleFill className="h-5 w-5 font-bold text-brand-800" />
                ) : (
                  <BsPinAngle className="h-5 w-5 font-bold text-brand-800" />
                )}
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={handleClick}
              >
                <HiX className="h-5 w-5 font-bold text-brand-800" />
              </button>
            </div>
          </div>

          {/* Pop-up content */}
          <ScrollArea className="relative grow overflow-y-auto overflow-x-hidden">
            {/* Top gradient */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 z-10 h-8 bg-gradient-to-b from-white to-transparent" />

            {/* Bottom gradient */}
            <div className="pointer-events-none absolute bottom-0 left-6 right-6 z-10 h-8 bg-gradient-to-t from-white to-transparent" />
            <div className="relative max-h-[calc(100svh_-_theme(space.20))] min-w-[375px] divide-y divide-gray-200 rounded-b-3xl bg-white">
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
