import * as React from 'react';

import cn from 'lib/classnames';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import Icon from 'components/ui/icon';

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
>(({ className }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn({
      'fixed inset-0 bg-brand-600/70 backdrop-blur-sm md:bg-black/50': true,
      [className]: !!className,
    })}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    overlay?: boolean;
    classNameContent?: string;
  }
>(({ className, classNameContent, children, overlay = false, ...props }, ref) => (
  <DialogPortal>
    {overlay && <DialogOverlay />}
    <DialogPrimitive.Content
      ref={ref}
      className={cn({
        'no-scrollbar absolute z-40 h-[100vh] w-full overflow-y-auto pr-16 animate-in duration-300 md:left-0 md:w-auto md:pt-10 md:pl-14 md:data-[state=open]:fade-in-60 md:data-[state=close]:slide-in-from-left-0 md:data-[state=open]:slide-in-from-left-96':
          true,
        [classNameContent]: !!classNameContent,
      })}
      style={{
        background: 'linear-gradient(90deg, #003C391A 0%, rgba(0, 60, 57, 0.00) 100%)',
      }}
      {...props}
    >
      <div
        className={cn({
          'relative flex shrink-0 flex-col bg-white p-8 shadow-widget md:min-h-[100px] md:w-full md:max-w-[540px] md:rounded-3xl':
            true,
          [className]: !!className,
        })}
      >
        {children}
      </div>
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
        'absolute -right-10 -top-2 flex h-11 w-10 cursor-pointer items-center justify-end rounded-r-[20px] focus:outline-none focus:ring-1 focus:ring-slate-400 focus:ring-offset-1 md:top-9 md:-z-10 md:bg-white/70 md:shadow-widget md:backdrop-blur-sm ':
          true,
        [className]: !!className,
      })}
      onClick={onClose}
      aria-label="close dialog"
    >
      <Icon icon={CLOSE_SVG} className="mr-2.5 h-7 w-7 md:h-6 md:w-6" description="Cross" />
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
