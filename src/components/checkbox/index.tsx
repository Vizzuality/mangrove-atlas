import * as React from 'react';

import cn from 'lib/classnames';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import Icon from 'components/icon';

import CHECK_SVG from 'svgs/ui/check.svg?sprite';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn({
      'h-4 w-4 shrink-0 rounded border-2 border-brand-800/50  text-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-400  focus:ring-offset-2 focus:ring-offset-brand-800 disabled:cursor-not-allowed disabled:opacity-50':
        true,
      [className]: !!className,
    })}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn({ 'flex items-center justify-center p-px text-brand-400': true })}
    >
      <Icon icon={CHECK_SVG} className="h-full w-full " />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
