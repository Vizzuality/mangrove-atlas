import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { MdOutlineDragHandle } from 'react-icons/md';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type MapPopupDragProps = {
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
  handleClickToDocker?: (e: React.MouseEvent) => void;
};

const MdOutlineDragHandleIcon = MdOutlineDragHandle as unknown as (
  p: React.SVGProps<SVGSVGElement>
) => JSX.Element;

const MapPopupDragHandler = ({
  listeners,
  attributes,
  handleClickToDocker = () => {},
}: MapPopupDragProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <button
          type="button"
          aria-label="Drag to move or double-click to dock popup"
          className="w-full flex-1 cursor-grab"
          {...listeners}
          {...attributes}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={handleClickToDocker}
        >
          <MdOutlineDragHandleIcon
            className="text-brand-800 mt-3 ml-6 h-6 w-6"
            onClick={handleClickToDocker}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent className="bg-gray-600 px-2 text-white">
        Drag to move or double-click to dock
      </TooltipContent>
    </Tooltip>
  );
};

export default MapPopupDragHandler;
