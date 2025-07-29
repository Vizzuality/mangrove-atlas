import { useDraggable } from '@dnd-kit/core';

type DraggableProps = {
  id: string;
  position: { x: number; y: number };
  isPinned?: boolean;
  children: (params: {
    listeners: ReturnType<typeof useDraggable>['listeners'];
    attributes: ReturnType<typeof useDraggable>['attributes'];
  }) => React.ReactNode;
};

export default function Draggable({ id, position, children, isPinned }: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  if (!position) return null;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: 'transform 0.1s ease-out',
    zIndex: 10000,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ listeners, attributes })}
    </div>
  );
}
