import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';

import { MdOutlineDragHandle } from 'react-icons/md';

import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { DraggableAttributes } from '@dnd-kit/core';

type MapPopupDragProps = {
  listeners: SyntheticListenerMap;
  attributes: DraggableAttributes;
  handleClickToDocker?: (e: React.MouseEvent) => void;
};

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
          <MdOutlineDragHandle
            className="ml-6 mt-3 h-6 w-6 text-brand-800"
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
