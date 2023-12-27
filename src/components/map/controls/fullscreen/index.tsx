import { useCallback, useEffect, useState } from 'react';

import cn from 'lib/classnames';

import Icon from 'components/icon';

import DISABLE_FULLSCREEN_SVG from 'svgs/map/disable-fullscreen.svg?sprite';
import ENABLE_FULLSCREEN_SVG from 'svgs/map/enable-fullscreen.svg?sprite';

export const FullScreen = ({ className }: { className?: string }) => {
  const [isFullScreen, setFullScreen] = useState(false);

  const toggleFullScreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setFullScreen(!!document.fullscreenElement);
    };

    window.document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      window.document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  return (
    <div
      className={cn({
        'group flex inline-flex h-11 w-11 flex-col items-center justify-center rounded-full rounded-full border bg-white shadow-control disabled:cursor-default disabled:bg-gray-50 disabled:outline-none':
          true,
        'bg-brand-600': isFullScreen,
        'hover:bg-gray-100': !isFullScreen,
        [className]: !!className,
      })}
      onClick={toggleFullScreen}
    >
      <Icon
        icon={isFullScreen ? DISABLE_FULLSCREEN_SVG : ENABLE_FULLSCREEN_SVG}
        className={cn({
          'h-5 w-5 bg-white group-disabled:fill-grey-75': true,
          'bg-brand-600': isFullScreen,
          'group-hover:bg-gray-100': !isFullScreen,
        })}
        description="Fullscreen"
      />
    </div>
  );
};

export default FullScreen;
