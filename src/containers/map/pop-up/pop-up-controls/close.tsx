import { HiX } from 'react-icons/hi';

import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from '@/components/ui/tooltip';

type MapPopupCloseProps = {
  handleClose: (e: React.MouseEvent) => void;
};

const HixIcon = HiX as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;

const MapPopupClose = ({ handleClose }: MapPopupCloseProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <button
          type="button"
          aria-label="Close popup"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md leading-none text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          onClick={handleClose}
        >
          <HixIcon className="text-brand-800 block h-5 w-5" />
        </button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          className="rounded bg-gray-700 px-2 py-1 text-sm text-white shadow"
          sideOffset={15}
        >
          Close popup
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};

export default MapPopupClose;
