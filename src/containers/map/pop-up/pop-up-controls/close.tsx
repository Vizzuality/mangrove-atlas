import { useCallback } from 'react';

import { mapDraggableTooltipPinnedAtom } from '@/store/map';

import { HiX } from 'react-icons/hi';
import { useSetRecoilState } from 'recoil';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type Position = { x: number; y: number };

type MapPopupCloseProps = {
  setPosition: (value: Position | null) => void;
};

const HixIcon = HiX as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;

const MapPopupClose = ({ setPosition }: MapPopupCloseProps) => {
  const setPin = useSetRecoilState(mapDraggableTooltipPinnedAtom);
  const handleClick = useCallback(() => {
    setPosition(null);
    setPin(false);
  }, [setPosition, setPin]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="Close popup"
          className="focus-visible:ring-brand-500 cursor-pointer rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2"
          onClick={handleClick}
        >
          <HixIcon className="text-brand-800 h-5 w-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="rounded bg-gray-700 px-2 py-1 text-sm text-white shadow">
        Close popup
      </TooltipContent>
    </Tooltip>
  );
};

export default MapPopupClose;
