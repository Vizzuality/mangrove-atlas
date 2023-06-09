import cn from 'lib/classnames';

import * as PopoverRadix from '@radix-ui/react-popover';

import Icon from 'components/icon';

import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

const PopoverRoot = ({ children, ...props }: PopoverRadix.PopoverProps) => (
  <PopoverRadix.Root {...props}>{children}</PopoverRadix.Root>
);

const PopoverTrigger = ({ className, children, ...props }: PopoverRadix.PopoverTriggerProps) => (
  <PopoverRadix.Trigger
    className={cn({
      'relative m-0 cursor-pointer border-b-2 border-b-brand-800 p-0 font-bold outline-none data-[state=checked]:bg-brand-800':
        true,
      [className]: !!className,
    })}
    {...props}
  >
    {children}
  </PopoverRadix.Trigger>
);

const PopoverContent = ({ className, children, ...props }: PopoverRadix.PopoverContentProps) => (
  <PopoverRadix.Content
    className={cn({
      'rounded-3xl bg-white  text-black/85 shadow-soft outline-none data-[state=checked]:bg-brand-800':
        true,
      [className]: !!className,
    })}
    {...props}
  >
    {children}
  </PopoverRadix.Content>
);

const PopoverPortal = ({ className, children, ...props }: PopoverRadix.PopoverPortalProps) => (
  <PopoverRadix.Portal
    className={cn({
      'relative h-7.5 w-12 cursor-pointer rounded-full border-2 border-brand-800 border-opacity-20 outline-none data-[state=checked]:bg-brand-800':
        true,
      [className]: !!className,
    })}
    {...props}
  >
    {children}
  </PopoverRadix.Portal>
);

const PopoverArrow = ({ className }: PopoverRadix.PopoverArrowProps) => (
  <PopoverRadix.Arrow
    className={cn({
      'duration-400 block h-5 w-5 translate-x-0.5 rounded-full bg-brand-800 transition-transform will-change-transform data-[state=checked]:translate-x-[19px] data-[state=checked]:bg-white':
        true,
      [className]: !!className,
    })}
  />
);

const PopoverAnchor = ({ className }: PopoverRadix.PopperAnchorProps) => (
  <PopoverRadix.Anchor
    className={cn({
      'duration-400 block h-5 w-5 rounded-full bg-brand-800 transition-transform will-change-transform data-[state=checked]:translate-x-[19px] data-[state=checked]:bg-white':
        true,
      [className]: !!className,
    })}
  >
    <Icon icon={ARROW_SVG} className=" h-2 w-2" />
  </PopoverRadix.Anchor>
);

const PopoverClose = ({ className }: PopoverRadix.PopoverCloseProps) => (
  <PopoverRadix.Close
    className={cn({
      'duration-400 block h-5 w-5 translate-x-0.5 rounded-full bg-brand-800 transition-transform will-change-transform data-[state=checked]:translate-x-[19px] data-[state=checked]:bg-white':
        true,
      [className]: !!className,
    })}
  />
);

export {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverAnchor,
  PopoverClose,
  PopoverPortal,
};
