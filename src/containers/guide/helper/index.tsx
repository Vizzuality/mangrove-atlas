import { useRef, useState, PropsWithChildren, useEffect } from 'react';

import { createPortal } from 'react-dom';

import cn from 'lib/classnames';

import { activeGuideAtom } from 'store/guide';

import { useRecoilValue } from 'recoil';

export const Helper = ({
  children,
  className,
  tooltipPosition,
  message,
}: PropsWithChildren<{
  className?: {
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
  }, [childrenRef, popOver]);

  return (
    <div>
      {isActive && (
        <div className="relative">
          <button
            className={cn({
              'absolute flex h-5 w-5 items-center justify-center': true,
              [className.button]: !!className.button,
              'pointer-events-none': popOver,
            })}
            onClick={() => setPopOver(true)}
          >
            {!popOver && isActive && (
              <span className="absolute inline-flex h-full w-full animate-[ping_1.5s_ease-in-out_infinite] rounded-full bg-brand-800 opacity-20" />
            )}

            {!popOver && isActive && (
              <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-800" />
            )}
          </button>
        </div>
      )}

      <div ref={childrenRef}>{children}</div>

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
                  'fixed z-[60] h-fit w-56 cursor-default rounded-md bg-white p-3': true,
                  [className.tooltip]: !!className.tooltip,
                })}
              >
                <p className="text-left font-sans text-sm font-light text-black/85 first-letter:uppercase">
                  {message}
                </p>
                {/* <svg
                  className="absolute left-0 top-full h-2.5 w-full rounded text-white"
                  x="0px"
                  y="0px"
                  viewBox="0 0 255 255"
                  xmlSpace="preserve"
                >
                  <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                </svg> */}
              </div>
            )}
          </div>,
          document?.body
        )}
    </div>
  );
};

export default Helper;
