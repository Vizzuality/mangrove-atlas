'use client';

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';

import cn from '@/lib/classnames';

import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

const labelVariants = cva(
  'text-sm font-semibold transition-colors leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants> & {
    required?: boolean;
  };

const Label = forwardRef<ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props}>
      <span className="inline-flex items-center gap-1">
        {children}
        {required && (
          <span aria-hidden="true" className="text-red-500">
            *
          </span>
        )}
      </span>
    </LabelPrimitive.Root>
  )
);

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
