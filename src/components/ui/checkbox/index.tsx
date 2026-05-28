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
      'text-brand-400 flex items-center justify-center p-px': true,
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
      'border-brand-800/50 text-brand-800 data-state-checked:bg-brand-800 inline-flex min-h-6 min-w-6 shrink-0 cursor-pointer items-center justify-center rounded border-2 p-0.5 disabled:cursor-not-allowed disabled:opacity-50 data-state-checked:border-4 data-state-checked:text-white':
        true,
    })}
    {...props}
  >
    {children ? (
      children
    ) : (
      <CheckboxIndicator
        className={cn({
          'text-brand-400 flex h-4 w-4 items-center justify-center p-px': true,
        })}
      >
        <CHECK_SVG className="h-full w-full fill-current" aria-hidden="true" />
      </CheckboxIndicator>
    )}
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;
CheckboxIndicator.displayName = CheckboxPrimitive.Indicator.displayName;

export { Checkbox, CheckboxIndicator };
