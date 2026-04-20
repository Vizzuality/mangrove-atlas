'use client';

import {
  mapDraggableTooltipDimensionsAtom,
  mapDraggableTooltipPinnedAtom,
  mapDraggableTooltipPositionAtom,
} from '@/store/map';

import { DndContext, MeasuringStrategy } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import MapContainer from '@/containers/map';

export default function ParamsLayout({ children }: { children: React.ReactNode }) {
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

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <div className="relative h-screen w-screen overflow-hidden print:overflow-visible">
        <MapContainer mapId="default" />
        {children}
      </div>
    </DndContext>
  );
}
