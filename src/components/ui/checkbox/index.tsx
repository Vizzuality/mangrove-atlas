import { forwardRef } from 'react';

import cn from '@/lib/classnames';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import CHECK_SVG from '@/svgs/ui/check';

const CheckboxIndicator = ({
  children,
  className,
  ...props
}: CheckboxPrimitive.CheckboxIndicatorProps) => (
  <CheckboxPrimitive.Indicator
    {...props}
    className={cn(className, {
      'flex items-center justify-center p-px text-brand-400': true,
    })}
  >
    {children}
  </CheckboxPrimitive.Indicator>
);

const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(className, {
      'shrink-0 rounded border-2 border-brand-800/50 text-brand-800 disabled:cursor-not-allowed disabled:opacity-50 data-[state-checked]:border-4 data-[state-checked]:bg-brand-800 data-[state-checked]:text-white':
        true,
    })}
    {...props}
  >
    {children ? (
      children
    ) : (
      <CheckboxIndicator
        className={cn({ 'flex h-4 w-4 items-center justify-center p-px text-brand-400': true })}
      >
        <CHECK_SVG className="fill-current h-full w-full" role="img" title="Checkmark" />
      </CheckboxIndicator>
    )}
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;
CheckboxIndicator.displayName = CheckboxPrimitive.Indicator.displayName;

export { Checkbox, CheckboxIndicator };
