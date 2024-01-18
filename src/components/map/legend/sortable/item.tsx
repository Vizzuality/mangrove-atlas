import React, { ReactElement, cloneElement } from 'react';

import cn from 'lib/classnames';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { SortableItemProps } from 'components/map/legend/types';

export const SortableItem: React.FC<SortableItemProps> = ({
  id,
  sortable,
  children,
}: SortableItemProps) => {
  const { attributes, listeners, transform, transition, isDragging, setNodeRef } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const CHILD = cloneElement(children as ReactElement, {
    sortable,
    listeners,
    attributes,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn({
        'w-full': true,
        'opacity-0': isDragging,
      })}
      style={style}
      {...(sortable?.handle && {
        ...listeners,
        ...attributes,
      })}
    >
      {CHILD}
    </div>
  );
};

export default SortableItem;
