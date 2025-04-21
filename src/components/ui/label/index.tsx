'use client';

import { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react';

import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import cn from 'lib/classnames';

const labelVariants = cva(
  'text-sm font-semibold transition-colors leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

const Label = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
