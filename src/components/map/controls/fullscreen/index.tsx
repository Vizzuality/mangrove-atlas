import { useCallback } from 'react';

import cn from '@/lib/classnames';

import { fullScreenAtom } from '@/store/map-settings';

import { useRecoilState } from 'recoil';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import DISABLE_FULLSCREEN_SVG from '@/svgs/map/disable-fullscreen';
import ENABLE_FULLSCREEN_SVG from '@/svgs/map/enable-fullscreen';

export const FullScreen = ({ className }: { className?: string }) => {
  const [isFullScreen, setFullScreen] = useRecoilState(fullScreenAtom);

  const toggleFullScreen = useCallback(() => {
    setFullScreen(!isFullScreen);
  }, [setFullScreen, isFullScreen]);

  const FullScreenIcon = isFullScreen ? DISABLE_FULLSCREEN_SVG : ENABLE_FULLSCREEN_SVG;

  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={cn({
            'group shadow-control inline-flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-full bg-white disabled:cursor-default disabled:bg-gray-50 disabled:outline-none':
              true,
            'border-brand-800 bg-brand-800': isFullScreen,
            'hover:bg-gray-100': !isFullScreen,
          })}
          onClick={toggleFullScreen}
        >
          <FullScreenIcon
            className={cn({
              'fill-current group-disabled:fill-grey-75 h-4 w-4 bg-white': true,
              'bg-brand-800': isFullScreen,
              'group-hover:bg-gray-100': !isFullScreen,
            })}
            role="img"
            aria-hidden={true}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-gray-600 px-2 text-white">Fullscreen</TooltipContent>
    </Tooltip>
  );
};

export default FullScreen;
