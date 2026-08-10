import { forwardRef } from 'react';

import cn from '@/lib/classnames';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Colours resolve to the project palette in `tailwind.config.mjs`.
 *
 * This file previously carried shadcn's semantic token names — `ring-ring`,
 * `ring-offset-background`, `bg-destructive`, `bg-accent`, `text-primary` —
 * none of which are defined here: there is no `@theme` block, no `:root`
 * custom properties, and no matching keys in the Tailwind config. Tailwind
 * emitted nothing for them, so the focus ring had no colour (WCAG 2.4.7) and
 * the destructive/ghost hover states rendered unstyled.
 *
 * They are mapped to real palette values rather than by introducing a
 * semantic-token layer, because the app has no theming layer to hang one on.
 */
const buttonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-3xl transition-colors text-sm font-medium ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 border',
  {
    variants: {
      variant: {
        default: 'bg-brand-800 text-white hover:bg-brand-800/90',
        destructive: 'bg-red-700 text-white hover:bg-red-700/90',
        outline:
          'text-brand-800 bg-transparent hover:bg-brand-100 hover:text-brand-900 border-brand-800/15',
        secondary: 'bg-white text-brand-800 hover:bg-brand-100 hover:text-brand-900',
        ghost: 'bg-brand-800/15 text-black/85 hover:bg-white hover:text-grey-600',
        link: 'text-brand-800 rounded-full underline-offset-4 hover:underline',
        rounded: 'rounded-full',
      },
      size: {
        default: 'px-4 py-2',
        sm: 'px-3',
        lg: 'px-6 py-3.5 rounded-[32px]',
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

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
