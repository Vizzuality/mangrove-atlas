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
        'inline-flex flex-col rounded-full shadow-md shadow-black/10': true,
        [className]: !!className,
      })}
    >
      <button
        className={cn({
          'group flex h-11 w-11 items-center justify-center rounded-full bg-white disabled:cursor-default disabled:bg-gray-50 disabled:outline-none':
            true,
          'bg-brand-600': isFullScreen,
        })}
        aria-label="Toggle fullscreen"
        type="button"
        onClick={toggleFullScreen}
      >
        <Icon
          icon={isFullScreen ? DISABLE_FULLSCREEN_SVG : ENABLE_FULLSCREEN_SVG}
          className={cn({
            'h-5 w-5 bg-white group-hover:opacity-50 group-disabled:fill-grey-75': true,
            'bg-brand-600': isFullScreen,
          })}
          description="Fullscreen"
        />
      </button>
    </div>
  );
};

export default FullScreen;
