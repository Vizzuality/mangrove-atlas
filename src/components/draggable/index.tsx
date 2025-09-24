import { useDraggable } from '@dnd-kit/core';

type DraggableProps = {
  id: string;
  position: { x: number; y: number };
  isPinned?: boolean;
  offsetX?: number;
  offsetY?: number;
  children: (params: {
    listeners: ReturnType<typeof useDraggable>['listeners'];
    attributes: ReturnType<typeof useDraggable>['attributes'];
  }) => React.ReactNode;
};

let transformStyle: string | undefined;

export default function Draggable({
  id,
  position,
  children,
  offsetX = -90,
  offsetY = -5,
  isPinned,
}: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  if (!position) return null;

  const top = Math.max(0, position.y - offsetY);

  if (transform) {
    if (isPinned) {
      transformStyle = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
    } else {
      transformStyle = `translate3d(${(transform.x ?? 0) + offsetX}px, ${(transform.y ?? 0) + offsetY}px, 0)`;
    }
  } else {
    transformStyle = undefined;
  }

  const style: React.CSSProperties = {
    position: 'absolute',
    left: position.x,
    top,
    transform: transformStyle,
    transition: 'transform 0.1s ease-out',
    zIndex: 10000,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ listeners, attributes })}
    </div>
  );
}
