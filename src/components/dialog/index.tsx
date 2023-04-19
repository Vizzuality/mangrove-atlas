/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';

import cn from 'lib/classnames';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import Icon from 'components/icon';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = ({ className, children, ...props }: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal className={className} {...props}>
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
      {children}
    </div>
  </DialogPrimitive.Portal>
);
DialogPortal.displayName = DialogPrimitive.Portal.displayName;
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn({
      'data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-100':
        true,
      [className]: !!className,
    })}
    {...props}
    ref={ref}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn({
        'animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 fixed top-10 left-[80px] z-[60] w-full bg-white p-6 sm:max-w-lg':
          true,
        [className]: !!className,
      })}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
    <DialogPrimitive.Close className="absolute top-16 left-[570px] z-50 flex h-11 w-16 cursor-pointer items-center justify-end rounded-[10px] border bg-white hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
      <Icon icon={CLOSE_SVG} className="mr-2.5 h-5 w-5" />
      <span className="sr-only">Close</span>
    </DialogPrimitive.Close>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn({
      'flex flex-col space-y-2 text-center sm:text-left': true,
      [className]: !!className,
    })}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';
const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn({
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2': true,
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
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
