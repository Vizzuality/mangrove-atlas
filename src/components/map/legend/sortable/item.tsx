import React, { ReactElement, cloneElement } from 'react';

import cn from '@/lib/classnames';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { SortableItemProps } from '@/components/map/legend/types';

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  sortable,
  children,
  'data-testid': dataTestId,
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
        'w-full border-b border-gray-200 py-4 first:pt-0 nth-last-3:border-b-0 nth-last-3:pb-0':
          true,
        'opacity-0': isDragging,
      })}
      style={style}
      data-testid={dataTestId}
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
