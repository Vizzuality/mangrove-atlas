import { PropsWithChildren, useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import cn from 'lib/classnames';

import { activeGuideAtom } from 'store/guide';

import { useRecoilValue } from 'recoil';

import Icon from 'components/ui/icon';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite';

export const Helper = ({
  children,
  className,
  tooltipPosition,
  message,
}: PropsWithChildren<{
  className?: {
    container?: string;
    button?: string;
    tooltip?: string;
    active?: string;
  };
  tooltipPosition?: {
    top: number;
    left?: number;
    right?: number;
  };
  message?: string;
}>) => {
  const childrenRef = useRef<HTMLDivElement>(null);
  const isActive = useRecoilValue(activeGuideAtom);
  const [popOver, setPopOver] = useState<boolean>(false);
  const [childrenPosition, saveChildrenPosition] = useState<Record<string, number>>({
    top: null,
    left: null,
    right: null,
  });

  useEffect(() => {
    const { top, left, right } = childrenRef.current?.getBoundingClientRect();
    saveChildrenPosition({
      top,
      left,
      right,
    });
  }, [childrenRef, popOver, isActive]);

  return (
    <div className={cn({ [className.container]: !!className.container })}>
      {isActive && (
        <div className="relative">
          <button
            className={cn({
              'absolute flex h-5 w-5 items-center justify-center': true,
              [className.button]: !!className.button,
              'pointer-events-none': popOver,
            })}
            data-testid="helper-button"
            onClick={() => setPopOver(true)}
          >
            {!popOver && isActive && (
              <span
                className={cn({
                  'absolute inline-flex h-full w-full animate-[ping_1.5s_ease-in-out_infinite] rounded-full bg-yellow-400 opacity-20':
                    true,
                })}
              />
            )}

            {!popOver && isActive && (
              <span
                className={cn({
                  'relative inline-flex h-3 w-3 rounded-full bg-yellow-400': true,
                })}
              />
            )}
          </button>
        </div>
      )}

      <div ref={childrenRef} className={cn({ [className.container]: !!className.container })}>
        {children}
      </div>

      {typeof window !== 'undefined' &&
        popOver &&
        createPortal(
          <div
            className="fixed inset-0 z-40 flex h-full w-full bg-black/50 backdrop-blur-sm"
            onClick={() => setPopOver(false)}
          >
            <div
              className={cn({
                'pointer-events-none absolute cursor-default': true,
                [className.button]: !!className.button,
                [className.active]: isActive,
              })}
              style={{
                top: childrenPosition?.top,
                left: childrenPosition?.left,
              }}
            >
              {children}
            </div>
            {popOver && isActive && (
              <div
                style={{
                  top: childrenPosition?.top - tooltipPosition.top,
                  left: childrenPosition?.left - tooltipPosition.left,
                }}
                className={cn({
                  'w-fit-content fixed z-[60] h-fit cursor-default rounded-md bg-white p-6': true,
                  [className.tooltip]: !!className.tooltip,
                })}
              >
                <p className="text-left font-sans text-sm font-light text-black/85 first-letter:uppercase">
                  {message}
                </p>
                <Icon
                  icon={CLOSE_SVG}
                  className="absolute top-2 right-2 h-4 w-4 shrink-0 cursor-pointer text-black/85"
                  description="Close"
                />
              </div>
            )}
          </div>,
          document?.body
        )}
    </div>
  );
};

export default Helper;
