import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  useCallback,
  useId,
  useMemo,
  useState,
} from 'react';

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { SortableListProps } from 'components/map/legend/types';

import SortableItem from './item';

export const SortableList: React.FC<SortableListProps> = ({
  children,
  sortable,
  onChangeOrder,
}: SortableListProps) => {
  const uid = useId();
  const [activeId, setActiveId] = useState<string>(null);

  const ActiveItem = useMemo(() => {
    const activeChildArray = Children.map(children, (Child) => {
      if (isValidElement(Child)) {
        const { props } = Child as ReactElement<unknown>;
        const { id } = props as { id: string };

        if (id === activeId) {
          return Child;
        }
        return null;
      }
      return null;
    });

    return activeChildArray[0] || null;
  }, [children, activeId]);

  const itemsIds = useMemo(() => {
    return Children.map(children, (Child) => {
      if (isValidElement(Child)) {
        const { props } = Child as ReactElement<unknown>;
        const { id } = props as { id: string };
        return id;
      }

      return null;
    });
  }, [children]);

  const sensors = useSensors(
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.5,
        tolerance: 10,
      },
    })
  );

  const handleDragStart = useCallback((event) => {
    const { active } = event as { active: { id: string } };
    if (!active) return;
    setActiveId(active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event as { active: { id: string }; over: { id: string } };
      setActiveId(null);

      if (active.id !== over?.id) {
        const oldIndex = itemsIds.indexOf(active.id);
        const newIndex = itemsIds.indexOf(over?.id);

        if (onChangeOrder) onChangeOrder(arrayMove(itemsIds, oldIndex, newIndex));
      }
    },
    [itemsIds, onChangeOrder]
  );

  return (
    <DndContext
      id={uid}
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={itemsIds} strategy={verticalListSortingStrategy}>
        {Children.map(children, (Child) => {
          if (isValidElement(Child)) {
            const { props } = Child as ReactElement<unknown>;
            const { id } = props as { id: string };

            return (
              <SortableItem id={id} sortable={sortable} data-testid={`legend-item-${id}`}>
                {cloneElement(Child as ReactElement, {
                  sortable,
                })}
              </SortableItem>
            );
          }
          return null;
        })}
      </SortableContext>

      <DragOverlay>
        {isValidElement(ActiveItem) && (
          <div className="flex max-h-[calc(100vh_-_theme(space.16)_-_theme(space.6)_-_theme(space.48)_-_theme(space.40))] flex-col overflow-hidden">
            {cloneElement(ActiveItem as ReactElement, {
              sortable,
            })}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default SortableList;
