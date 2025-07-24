import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';
import { HiX } from 'react-icons/hi';
import { useCallback } from 'react';

type Position = { x: number; y: number };

type MapPopupCloseProps = {
  setPosition: (value: Position | null) => void;
};

const MapPopupClose = ({ setPosition }: MapPopupCloseProps) => {
  const handleClick = useCallback(() => {
    setPosition(null);
  }, [setPosition]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="Close popup"
          className="focus-visible:ring-brand-500 cursor-pointer rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2"
          onClick={handleClick}
        >
          <HiX className="h-5 w-5 text-brand-800" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        align="start"
        className="rounded bg-gray-700 px-2 py-1 text-sm text-white shadow"
      >
        Close popup
      </TooltipContent>
    </Tooltip>
  );
};

export default MapPopupClose;
