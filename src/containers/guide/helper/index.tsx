import { useState } from 'react';

import cn from 'lib/classnames';

import { activeGuideAtom } from 'store/guide';

import { useRecoilValue } from 'recoil';

export const Helper = ({
  children,
  className,
  message,
}: {
  children: React.ReactNode;
  className?: {
    button?: string;
    tooltip?: string;
  };
  message?: string;
}) => {
  const isActive = useRecoilValue(activeGuideAtom);
  const [popOver, setPopOver] = useState<boolean>(false);

  return (
    <div>
      {isActive && (
        <div className="helper relative">
          <button
            className={cn({
              'absolute flex h-5 w-5 items-center justify-center': true,
              [className.button]: !!className.button,
            })}
            onClick={() => setPopOver(true)}
          >
            {!popOver && (
              <span className="absolute inline-flex h-full w-full animate-[ping_1.5s_ease-in-out_infinite] rounded-full bg-brand-400 opacity-50" />
            )}

            {!popOver && (
              <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-800" />
            )}

            {popOver && (
              <div
                className={cn({
                  'absolute bottom-6 left-0 z-[100] h-fit w-56 rounded-md bg-white p-3 ': true,
                  [className.tooltip]: !!className.tooltip,
                })}
              >
                <p className="text-left font-sans text-sm font-light text-black/85">{message}</p>
                <svg
                  className="absolute left-0 top-full h-2.5 w-full rounded text-white"
                  x="0px"
                  y="0px"
                  viewBox="0 0 255 255"
                  xmlSpace="preserve"
                >
                  <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                </svg>
              </div>
            )}
          </button>

          {popOver && (
            <div
              className="fixed inset-0 top-0 flex h-full w-full bg-black/50 backdrop-blur-sm"
              onClick={() => setPopOver(false)}
            ></div>
          )}
        </div>
      )}

      <div
        className={cn({
          'z-[80]': popOver && isActive,
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default Helper;
