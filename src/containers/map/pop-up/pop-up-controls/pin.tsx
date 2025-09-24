import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';

import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs';

type MapPopupPinProps = {
  handleClickToDocker?: (e: React.MouseEvent) => void;
  isPinned?: boolean;
};

const MapPopupPin = ({ handleClickToDocker = () => {}, isPinned }: MapPopupPinProps) => (
  <Tooltip>
    <TooltipTrigger>
      <button
        type="button"
        className="cursor-pointer rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        onClick={handleClickToDocker}
      >
        {isPinned ? (
          <BsPinAngleFill className="h-5 w-5 font-bold text-brand-800" />
        ) : (
          <BsPinAngle className="h-5 w-5 font-bold text-brand-800" />
        )}
      </button>
    </TooltipTrigger>
    <TooltipContent className="bg-gray-600 px-2 text-white">
      {isPinned ? 'Unpin popup' : 'Pin popup'}
    </TooltipContent>
  </Tooltip>
);

export default MapPopupPin;
