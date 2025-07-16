import cn from 'lib/classnames';

import Draggable from 'containers/draggable';
import { isEmpty } from 'lodash-es';
import { useRecoilState } from 'recoil';

// POPUPS
import IucnEcoregionPopup from 'containers/datasets/iucn-ecoregion/map-popup';
import type { IUCNEcoregionPopUpInfo } from 'containers/datasets/iucn-ecoregion/types';
import LocationPopup from 'containers/datasets/locations/map-popup';
import RestorationSitesPopup from 'containers/datasets/restoration-sites/map-popup';
import RestorationPopup from 'containers/datasets/restoration/map-popup';

import type { LocationPopUp, RestorationPopUp, RestorationSitesPopUp } from 'types/map';
import { mapDraggableTooltipPositionAtom } from 'store/map';

import { MdOutlineDragHandle } from 'react-icons/md';
import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { HiX } from 'react-icons/hi';
import { ScrollArea } from 'components/ui/scroll-area';
export const DEFAULT_PROPS = {
  initialViewState: {
    longitude: 0,
    latitude: 20,
    zoom: 2,
    pitch: 0,
    bearing: 0,
  },
  minZoom: 1,
  maxZoom: 20,
};

const MapPopup = ({
  locationInfo,
  restorationInfo,
  restorationsitesInfo,
  iucnEcoregionInfo,
}: {
  locationInfo: {
    info: LocationPopUp;
    position?: { x: number; y: number };
    feature: MapboxGeoJSONFeature;
  };
  restorationInfo: { info: RestorationPopUp };
  restorationsitesInfo: { info: RestorationSitesPopUp };
  iucnEcoregionInfo: { info: IUCNEcoregionPopUpInfo };
}) => {
  const [position, setPosition] = useRecoilState(mapDraggableTooltipPositionAtom);

  const handleClick = () => {
    setPosition(null);
  };
  if (!locationInfo.info) return null;

  return (
    <Draggable position={position} id="draggable-map-popup">
      {({ listeners, attributes }) => (
        <div
          className={cn(
            'w-fit-content shadow-popup absolute z-50 flex flex-col rounded-3xl border border-gray-300 bg-white'
          )}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle */}
          <div className="flex w-full items-center justify-between rounded-t-3xl px-6 pt-3 hover:bg-white/90">
            <button
              type="button"
              className="w-full flex-1 cursor-move"
              {...listeners}
              {...attributes}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <MdOutlineDragHandle className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              onClick={handleClick}
            >
              <HiX className="h-6 w-6 font-bold text-brand-800" />
            </button>
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
                onClose={() => removePopup('location')}
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
