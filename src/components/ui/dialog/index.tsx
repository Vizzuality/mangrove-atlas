import { forwardRef, ElementRef, ComponentPropsWithoutRef, HTMLAttributes } from 'react';

import cn from '@/lib/classnames';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import Icon from '@/components/ui/icon';

import CLOSE_SVG from '@/svgs/ui/close.svg?sprite';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = ({ children, ...props }: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal {...props}>
    <div className="absolute top-0 right-0 bottom-0 left-0 z-60 flex h-full w-full items-start justify-center md:items-center">
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
    className={cn(className, {
      'bg-brand-600/70 fixed inset-0 backdrop-blur-sm md:bg-black/50': true,
    })}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    overlay?: boolean;
    classNameContent?: string;
  }
>(({ className, classNameContent, children, overlay = false, ...props }, ref) => (
  <DialogPortal>
    {overlay && <DialogOverlay />}
    <DialogPrimitive.Content
      ref={ref}
      className={cn(classNameContent, {
        'no-scrollbar animate-in md:data-[state=open]:fade-in-60 md:data-[state=close]:slide-in-from-left-0 md:data-[state=open]:slide-in-from-left-96 absolute z-40 h-[100vh] w-full overflow-y-auto duration-300 sm:pr-16 md:left-0 md:w-auto md:pt-10 md:pl-14':
          true,
      })}
      style={{
        background: 'linear-gradient(90deg, #003C391A 0%, rgba(0, 60, 57, 0.00) 100%)',
      }}
      {...props}
    >
      <div
        className={cn(className, {
          'shadow-card relative flex shrink-0 flex-col bg-white p-8 md:w-full md:max-w-[540px] md:rounded-3xl':
            true,
        })}
      >
        {children}
      </div>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(className, {
      'flex flex-col space-y-2 text-center md:text-left': true,
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
      className={cn(className, {
        'md:shadow-card absolute -top-2 -right-10 flex h-11 w-10 cursor-pointer items-center justify-end rounded-r-[20px] focus:ring-1 focus:ring-slate-400 focus:ring-offset-1 focus:outline-none md:top-9 md:-z-10 md:bg-white/70 md:backdrop-blur-sm':
          true,
      })}
      onClick={onClose}
      aria-label="close dialog"
    >
      <Icon icon={CLOSE_SVG} className="mr-2.5 h-7 w-7 md:h-6 md:w-6" description="Cross" />
    </button>
  </DialogPrimitive.Close>
);
DialogClose.displayName = 'DialogClose';

const DialogFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(className, {
      'flex flex-col-reverse md:flex-row md:justify-end md:space-x-2': true,
    })}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(className, {
      'text-lg font-semibold text-slate-900': true,
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
    className={cn(className, {
      'text-sm text-slate-500': true,
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
