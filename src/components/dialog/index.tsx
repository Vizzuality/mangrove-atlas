import * as React from 'react';

import cn from 'lib/classnames';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import Icon from 'components/icon';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = ({ className, children, ...props }: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal className={className} {...props}>
    <div className="absolute top-0 left-0 z-50 flex h-full w-full items-start justify-center md:z-20 md:items-center">
      {children}
    </div>
  </DialogPrimitive.Portal>
);
DialogPortal.displayName = DialogPrimitive.Portal.displayName;
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className }) => (
  <div
    className={cn({
      'fixed inset-0 bg-brand-600/70 backdrop-blur-sm md:bg-black/50': true,
      [className]: !!className,
    })}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { overlay?: boolean }
>(({ className, children, overlay = true, ...props }, ref) => (
  <DialogPortal>
    {overlay && <DialogOverlay />}
    <DialogPrimitive.Content
      ref={ref}
      className={cn({
        'left-1/12 fixed top-[5%] grid max-h-[85vh] min-h-[100px] w-10/12 gap-4 bg-white p-6 animate-in duration-300 md:left-18 md:w-full md:max-w-[540px] md:data-[state=open]:fade-in-60 md:data-[state=close]:slide-in-from-left-0 md:data-[state=open]:slide-in-from-left-96':
          true,
        [className]: !!className,
      })}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn({
      'flex flex-col space-y-2 text-center md:text-left': true,
      [className]: !!className,
    })}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogClose = ({ onClose = () => null }: { onClose?: () => void }) => (
  <DialogPrimitive.Close asChild>
    <button
      type="button"
      className="absolute top-7 right-6 z-40 flex h-11 w-10 cursor-pointer items-center justify-end rounded-r-[10px] bg-white hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 md:top-7 md:-right-10 md:border"
      onClick={onClose}
      aria-label="close dialog"
    >
      <Icon icon={CLOSE_SVG} className="mr-2.5 h-7 w-7 md:h-5 md:w-5" description="Cross" />
      <span className="sr-only">Close</span>
    </button>
  </DialogPrimitive.Close>
);
DialogClose.displayName = 'DialogClose';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn({
      'flex flex-col-reverse md:flex-row md:justify-end md:space-x-2': true,
      [className]: !!className,
    })}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn({ 'text-lg font-semibold text-slate-900': true, [className]: !!className })}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn({
      'text-sm text-slate-500': true,
      [className]: !!className,
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
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
