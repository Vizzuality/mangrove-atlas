import * as React from 'react';

import { cn } from 'lib/classnames';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import Icon from 'components/ui/icon';

import CHECK_SVG from 'svgs/ui/check.svg?sprite';

const CheckboxIndicator = ({
  children,
  className,
  ...props
}: CheckboxPrimitive.CheckboxIndicatorProps) => (
  <CheckboxPrimitive.Indicator
    {...props}
    className={cn({
      'flex items-center justify-center p-px text-brand-400': true,
      [className]: !!className,
    })}
  >
    {children}
  </CheckboxPrimitive.Indicator>
);

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn({
      'shrink-0 rounded border-2 border-brand-800/50 text-brand-800 disabled:cursor-not-allowed disabled:opacity-50 data-[state-checked]:border-4 data-[state-checked]:bg-brand-800 data-[state-checked]:text-white':
        true,
      [className]: !!className,
    })}
    {...props}
  >
    {children ? (
      children
    ) : (
      <CheckboxIndicator
        className={cn({ 'flex h-4 w-4 items-center justify-center p-px text-brand-400': true })}
      >
        <Icon icon={CHECK_SVG} className="h-full w-full" description="Checkmark" />
      </CheckboxIndicator>
    )}
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;
CheckboxIndicator.displayName = CheckboxPrimitive.Indicator.displayName;

export { Checkbox, CheckboxIndicator };
