import { useCallback } from 'react';

import { useMap } from 'react-map-gl';

import cn from '@/lib/classnames';

import { locationTypeAtom, locationIdAtom } from '@/store/locations';
import {
  mapDraggableTooltipDimensionsAtom,
  mapDraggableTooltipPinnedAtom,
  mapDraggableTooltipPositionAtom,
} from '@/store/map';
import { printModeState } from '@/store/print-mode';

import { DndContext, MeasuringStrategy } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { useLocation } from '@/containers/datasets/locations/hooks';
import type { LocationTypes } from '@/containers/datasets/locations/types';
import MapContainer from '@/containers/map';
import WelcomeIntroMessage from '@/containers/welcome-message';
import WidgetsContainer from '@/containers/widgets';

import Logo from 'components/logo';

const DesktopLayout = () => {
  const map = useMap();

  const isPrintingMode = useAtomValue(printModeState);

  const isPrintingId = isPrintingMode ? 'print-mode' : 'no-print';
  const locationType = (useAtomValue(locationTypeAtom) || 'worldwide') as LocationTypes;
  const id = useAtomValue(locationIdAtom);
  const setPosition = useSetAtom(mapDraggableTooltipPositionAtom);
  const [isPinnedGlobally, setPinnedGlobally] = useAtom(mapDraggableTooltipPinnedAtom);
  const mapPopUpDimensions = useAtomValue(mapDraggableTooltipDimensionsAtom);

  const handleDragEnd = (event) => {
    const { delta } = event;
    const { h, w } = mapPopUpDimensions || { h: 0, w: 0 };
    setPosition((prev) => {
      return {
        x:
          prev.x + delta.x < 0
            ? 0
            : prev.x + delta.x > window.innerWidth - w
              ? window.innerWidth - w
              : prev.x + delta.x,
        y:
          prev.y + delta.y < 0
            ? 0
            : prev.y + delta.y > window.innerHeight - h
              ? window.innerHeight - h
              : prev.y + delta.y,
      };
    });

    if (isPinnedGlobally) {
      setPinnedGlobally(false);
    }
  };

  const { data: locationData } = useLocation(id, locationType);
  const location = locationData?.name;

  const handleReset = useCallback(() => {
    // `useMap()` returns a truthy MapCollection even before any <Map /> has
    // mounted; the keyed ref is what can be undefined during the async init
    // window (and forever in non-WebGL environments). Chain through the key.
    map?.['default-desktop-no-print']?.flyTo({
      center: [0, 20],
      zoom: 2,
    });
  }, [map]);

  return (
    <div className="overflow-hidden print:overflow-visible">
      <DndContext
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
      >
        <Logo
          src="/images/logo-bg.png"
          position="top-right"
          width={186}
          height={216}
          onClick={handleReset}
        />

        <div className="relative h-screen w-screen">
          {isPrintingMode && (
            <div className="print:absolute print:top-6 print:z-50 print:text-black">
              <h1
                className={cn({
                  'm-auto w-screen text-center first-letter:uppercase': true,
                  'text-lg': (location?.length ?? 0) < 10,
                  'text-md': (location?.length ?? 0) > 10,
                })}
              >
                {location}
              </h1>

              <p className="text-center">
                Powered by Global Mangrove Watch. https://www.globalmangrovewatch.org
              </p>
            </div>
          )}

          <MapContainer mapId={`default-desktop-${isPrintingId}`} />
          <WidgetsContainer />

          <WelcomeIntroMessage />
        </div>
      </DndContext>
    </div>
  );
};

export default DesktopLayout;
