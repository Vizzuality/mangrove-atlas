import {
  Children,
  forwardRef,
  isValidElement,
  ElementRef,
  ComponentPropsWithoutRef,
  HTMLAttributes,
  ReactNode,
} from 'react';

import cn from '@/lib/classnames';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import CLOSE_SVG from '@/svgs/ui/close';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = ({ children, ...props }: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal {...props}>
    <div className="w-100vw absolute top-0 right-0 bottom-0 left-0 z-60 flex h-full w-full items-start justify-start sm:justify-center md:items-center xl:items-start xl:justify-start">
      {children}
    </div>
  </DialogPrimitive.Portal>
);
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

const DialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn({
      'bg-brand-600/70 fixed inset-0 bg-blend-multiply md:bg-black/15': true,
      [className || '']: !!className,
    })}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    overlay?: boolean;
    classNameContent?: string;
    hideScrollFade?: boolean;
  }
>(
  (
    {
      className,
      classNameContent,
      children,
      overlay: _overlay,
      hideScrollFade,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const childArray = Children.toArray(children);
    const isClose = (child: ReactNode) =>
      isValidElement(child) &&
      (child.type as { displayName?: string })?.displayName === 'DialogClose';
    const closeButton = childArray.find(isClose);
    const restChildren = childArray.filter((c) => !isClose(c));

    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          aria-describedby={ariaDescribedBy}
          className={cn({
            'scrollbar-hide animate-in md:data-[state=open]:fade-in-60 md:data-[state=close]:slide-in-from-left-0 md:data-[state=open]:slide-in-from-left-96 pointer-events-none absolute z-40 h-screen w-full overflow-hidden duration-300 sm:p-4':
              true,

            [classNameContent || '']: !!classNameContent,
          })}
          {...props}
        >
          <div className="pointer-events-auto relative mx-auto w-full sm:max-w-135 xl:mx-0 xl:mt-4 xl:ml-6">
            <div
              className={cn({
                'sm:shadow-card flex max-h-screen w-full shrink-0 flex-col overflow-y-auto border-none bg-white p-6 sm:max-h-[calc(100vh-4rem)] sm:p-8 md:rounded-3xl':
                  true,
                [className || '']: !!className,
              })}
            >
              {!hideScrollFade && (
                <div className="pointer-events-none sticky -top-6 z-20 -mx-6 -mt-6 -mb-2 h-8 shrink-0 bg-gradient-to-b from-white to-transparent sm:-top-8 sm:-mx-8 sm:-mt-8 sm:mb-0" />
              )}
              {restChildren}
              {!hideScrollFade && (
                <div className="pointer-events-none sticky -bottom-6 z-20 -mx-6 -mt-2 -mb-6 h-8 shrink-0 bg-gradient-to-t from-white to-transparent sm:-bottom-8 sm:-mx-8 sm:mt-0 sm:-mb-8" />
              )}
            </div>
            {closeButton}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  }
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn({
      'flex flex-col space-y-2 text-center md:text-left': true,
      [className || '']: !!className,
    })}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogClose = ({
  onClose = () => null,
  className,
}: {
  onClose?: () => void;
  className?: string;
}) => (
  <DialogPrimitive.Close asChild>
    <button
      type="button"
      className={cn({
        'md:shadow-card absolute top-4 right-4 z-10 flex h-11 w-10 cursor-pointer items-center justify-end focus:ring-1 focus:ring-slate-400 focus:ring-offset-1 focus:outline-none sm:-top-2 sm:-right-10 sm:rounded-r-[20px] md:top-7 md:bg-white/70 md:backdrop-blur-sm':
          true,
        [className || '']: !!className,
      })}
      onClick={onClose}
      aria-label="Close dialog"
    >
      <CLOSE_SVG className="mr-2.5 h-7 w-7 fill-current md:h-6 md:w-6" aria-hidden="true" />
    </button>
  </DialogPrimitive.Close>
);
DialogClose.displayName = 'DialogClose';

const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn({
      'text-lg font-semibold text-slate-900': true,
      [className || '']: !!className,
    })}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn({
      'text-sm text-slate-500': true,
      [className || '']: !!className,
    })}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogDescription,
};
