import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import cn from '@/lib/classnames';

import { activeGuideAtom } from '@/store/guide';

import { useAtomValue } from 'jotai';

import CLOSE_SVG from '@/svgs/ui/close';

const Helper = ({
  children,
  className,
  tooltipPosition,
  message,
  content,
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
  content?: React.ReactNode;
}>) => {
  const childrenRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isActive = useAtomValue(activeGuideAtom);
  const [popOver, setPopOver] = useState<boolean>(false);
  const [childrenPosition, setChildrenPosition] = useState<Record<string, number>>({
    top: null,
    left: null,
    right: null,
  });

  const handlePopover = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = childrenRef.current?.getBoundingClientRect();
    if (rect) {
      setChildrenPosition({ top: rect.top, left: rect.left, right: rect.right });
    }
    setPopOver((prev) => !prev);
  }, []);

  const closePopover = useCallback(() => {
    setPopOver(false);
    // The trigger is the only thing left to return focus to — the overlay is unmounting.
    triggerRef.current?.focus();
  }, []);

  // The message sits inside the backdrop, so a click on it bubbles up to the backdrop's own
  // dismiss handler — closing the help the user is reading, and making its text unselectable.
  // Only dismiss when the backdrop itself was hit.
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) closePopover();
    },
    [closePopover]
  );

  // The overlay is dismissed by clicking it, so keyboard users need Escape to get out. Tab is
  // kept inside the message too — the overlay hides the rest of the page, so tabbing into it
  // would move focus somewhere the user can no longer see.
  useEffect(() => {
    if (!popOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closePopover();
        return;
      }

      if (e.key !== 'Tab' || !tooltipRef.current) return;

      const focusable = tooltipRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [popOver, closePopover]);

  // Move focus into the message so a keyboard user lands on the content they just opened.
  useEffect(() => {
    if (popOver) closeRef.current?.focus();
  }, [popOver]);

  return (
    <div className={cn({ [className.container]: !!className.container })}>
      {isActive && (
        <div className="relative">
          <button
            ref={triggerRef}
            type="button"
            aria-label="Show help for this control"
            aria-expanded={popOver}
            className={cn({
              // 20x20 visually, but absolutely positioned, so it cannot rely on the
              // spacing exemption in WCAG 2.2 2.5.8. The ::before pseudo-element
              // extends the hit area to 24x24 without changing the visual size.
              'focus-visible:ring-brand-800 absolute flex h-5 w-5 items-center justify-center rounded-full before:absolute before:-inset-[2px] before:content-[""] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none': true,
              [className.button]: !!className.button,
              'pointer-events-none': popOver,
            })}
            data-testid="helper-button"
            onClick={handlePopover}
          >
            {!popOver && isActive && (
              <span
                className={cn({
                  'absolute inline-flex h-full w-full animate-[ping_1.5s_ease-in-out_infinite] rounded-full bg-yellow-400 opacity-20': true,
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
            // Click-to-dismiss backdrop with no semantics of its own; Escape is handled at the
            // document level so this doesn't need to be reachable by keyboard.
            role="presentation"
            className="fixed inset-0 z-40 flex h-full w-full bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
          >
            {/*
              A visual echo of the highlighted control, rendered so it appears above the overlay.
              It duplicates `children` — ids included — so it must stay out of the accessibility
              tree and the tab order; the real control is still in the page behind the overlay.
            */}
            <div
              aria-hidden="true"
              inert=""
              className={cn({
                'pointer-events-none fixed cursor-default': true,
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
                ref={tooltipRef}
                role="dialog"
                aria-modal="true"
                aria-label="Help"
                style={{
                  top: childrenPosition?.top - tooltipPosition.top,
                  left: childrenPosition?.left - tooltipPosition.left || 'auto',
                  right: childrenPosition?.right - tooltipPosition?.right || 'auto',
                  zIndex: 10000,
                }}
                className={cn({
                  'w-fit-content fixed z-60 h-fit cursor-default rounded-md bg-white p-6': true,
                  [className.tooltip]: !!className.tooltip,
                })}
              >
                {message && (
                  <p className="text-left font-sans text-sm font-light text-black/85 first-letter:uppercase">
                    {message}
                  </p>
                )}
                {!!content && content}
                <button
                  ref={closeRef}
                  type="button"
                  aria-label="Close help"
                  onClick={closePopover}
                  className="focus-visible:ring-brand-800 absolute top-2 right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded focus-visible:ring-2 focus-visible:outline-none"
                >
                  <CLOSE_SVG
                    className="h-4 w-4 shrink-0 fill-current text-black/85"
                    aria-hidden="true"
                  />
                </button>
              </div>
            )}
          </div>,
          document?.body
        )}
    </div>
  );
};

export default Helper;
