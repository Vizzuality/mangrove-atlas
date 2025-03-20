import { useCallback } from 'react';

import cn from 'lib/classnames';

import { fullScreenAtom } from 'store/map-settings';

import { useRecoilState } from 'recoil';

import Icon from 'components/ui/icon';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';

import DISABLE_FULLSCREEN_SVG from 'svgs/map/disable-fullscreen.svg?sprite';
import ENABLE_FULLSCREEN_SVG from 'svgs/map/enable-fullscreen.svg?sprite';

export const FullScreen = ({ className }: { className?: string }) => {
  const [isFullScreen, setFullScreen] = useRecoilState(fullScreenAtom);

  const toggleFullScreen = useCallback(() => {
    setFullScreen(!isFullScreen);
  }, [setFullScreen, isFullScreen]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn({
            'group inline-flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-full bg-white shadow-control disabled:cursor-default disabled:bg-gray-50 disabled:outline-none':
              true,
            'border-brand-800 bg-brand-800': isFullScreen,
            'hover:bg-gray-100': !isFullScreen,
            [className]: !!className,
          })}
          onClick={toggleFullScreen}
        >
          <Icon
            icon={isFullScreen ? DISABLE_FULLSCREEN_SVG : ENABLE_FULLSCREEN_SVG}
            className={cn({
              'h-4 w-4 bg-white group-disabled:fill-grey-75': true,
              'bg-brand-800': isFullScreen,
              'group-hover:bg-gray-100': !isFullScreen,
            })}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent side="left" align="start" className="bg-gray-600 px-2 text-white">
        Fullscreen
      </TooltipContent>
    </Tooltip>
  );
};

export default FullScreen;
