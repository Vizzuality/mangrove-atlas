import React, { ReactElement, cloneElement } from 'react';

import cn from '@/lib/classnames';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { SortableItemProps } from '@/components/map/legend/types';

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  sortable,
  divided = true,
  children,
  'data-testid': dataTestId,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef,
    setActivatorNodeRef,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // The drag activator goes on the child's own handle button. Spreading it here
  // instead would give this wrapper `role="button"` and `tabindex="0"` around the
  // item's other controls — nested interactive content (WCAG 4.1.2).
  const CHILD = cloneElement(children as ReactElement, {
    sortable,
    listeners,
    attributes,
    setActivatorNodeRef,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn({
        'w-full': true,
        'border-b border-gray-200 py-4 first:pt-0 nth-last-3:border-b-0 nth-last-3:pb-0': divided,
        'opacity-0': isDragging,
      })}
      style={style}
      data-testid={dataTestId}
    >
      {CHILD}
    </div>
  );
};

export default SortableItem;
