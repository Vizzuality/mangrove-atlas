import { useDraggable } from '@dnd-kit/core';

type DraggableProps = {
  id: string;
  position: { x: number; y: number };
  children: (params: {
    listeners: ReturnType<typeof useDraggable>['listeners'];
    attributes: ReturnType<typeof useDraggable>['attributes'];
  }) => React.ReactNode;
};

export default function Draggable({ id, position, children }: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  if (!position) return null;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0) translate(${-470 / 2}px, 20px)`,
    transition: 'transform 0.1s ease-out',
    zIndex: 10000,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ listeners, attributes })}
    </div>
  );
}
