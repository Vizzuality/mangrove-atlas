import * as React from 'react';

import cn from 'lib/classnames';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-3xl transition-colors text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border h-8',
  {
    variants: {
      variant: {
        default: 'bg-brand-800 text-white hover:bg-opacity-90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground border-brand-800/15',
        secondary: 'bg-white text-brand-800 hover:bg-accent hover:text-accent-foreground',
        ghost: 'bg-brand-800/15 text-black/85 hover:bg-white hover:text-grey-800',
        link: 'text-primary rounded-full underline-offset-4 hover:underline',
        rounded: 'rounded-full',
      },
      size: {
        default: 'px-4 py-2',
        sm: 'px-3',
        lg: 'px-5',
        xl: 'px-8',
        icon: 'h-11 w-11',
        none: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
