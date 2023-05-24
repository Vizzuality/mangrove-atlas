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
        'inline-flex flex-col rounded-md shadow-md shadow-black/10': true,
        [className]: !!className,
      })}
    >
      <button
        className={cn({
          'group rounded-md bg-white p-3 hover:bg-gray-100 active:outline active:outline-2 active:-outline-offset-[5px] active:outline-brand-400/40 disabled:cursor-default disabled:bg-gray-50 disabled:outline-none':
            true,
        })}
        aria-label="Toggle fullscreen"
        type="button"
        onClick={toggleFullScreen}
      >
        <Icon
          icon={isFullScreen ? DISABLE_FULLSCREEN_SVG : ENABLE_FULLSCREEN_SVG}
          className="h-5 w-5 group-disabled:fill-grey-75"
        />
      </button>
    </div>
  );
};

export default FullScreen;
