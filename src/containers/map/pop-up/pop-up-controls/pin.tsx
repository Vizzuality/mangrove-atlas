import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const BsPinAngleIcon = BsPinAngle as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;
const BsPinAngleFillIcon = BsPinAngleFill as unknown as (
  p: React.SVGProps<SVGSVGElement>
) => JSX.Element;

type MapPopupPinProps = {
  handleClickToDocker?: (e: React.MouseEvent) => void;
  isPinned?: boolean;
};

const MapPopupPin = ({ handleClickToDocker = () => {}, isPinned }: MapPopupPinProps) => (
  <Tooltip>
    <TooltipTrigger>
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md leading-none text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        onClick={handleClickToDocker}
      >
        {isPinned ? (
          <BsPinAngleFillIcon className="text-brand-800 h-5 w-5 font-bold" />
        ) : (
          <BsPinAngleIcon className="text-brand-800 h-5 w-5 font-bold" />
        )}
      </button>
    </TooltipTrigger>
    <TooltipContent className="bg-gray-600 px-2 text-white" sideOffset={15}>
      {isPinned ? 'Unpin popup' : 'Pin popup'}
    </TooltipContent>
  </Tooltip>
);

export default MapPopupPin;
