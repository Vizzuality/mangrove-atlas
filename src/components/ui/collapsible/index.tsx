'use client';

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';

import cn from '@/lib/classnames';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

import SvgMinus from '@/svgs/ui/minus';
import SvgPlus from '@/svgs/ui/plus';

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> & {
    inset?: boolean;
    children?: React.ReactNode;
    className?: string;
    iconType?: 'arrow' | 'plus-minus' | null;
    iconSize?: 'md' | 'sm';
    isOpen?: boolean;
  }
>(({ className, children, iconType = 'arrow', iconSize = 'md', ...props }, ref) => {
  return (
    <CollapsiblePrimitive.Trigger
      ref={ref}
      className={cn(
        'group flex w-full items-center justify-between p-6 whitespace-nowrap text-black/85',
        className
      )}
      {...props}
    >
      {children}

      {iconType === 'plus-minus' && (
        <SvgMinus className="text-brand-800 h-6 w-6 cursor-pointer group-data-[state=closed]:hidden group-data-[state=open]:block" />
      )}

      {iconType === 'plus-minus' && (
        <SvgPlus className="text-brand-800 h-6 w-6 cursor-pointer group-data-[state=closed]:block group-data-[state=open]:hidden" />
      )}

      {iconType === 'arrow' && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn({
            'text-brand-800 lucide lucide-chevron-down-icon lucide-chevron-down h-4 w-4 group-data-[state=closed]:block group-data-[state=open]:hidden':
              true,
            'h-6 w-6': iconSize === 'md',
            'h-4 w-4': iconSize === 'sm',
          })}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      )}

      {iconType === 'arrow' && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn({
            'text-brand-800 lucide lucide-chevron-up-icon lucide-chevron-up h-4 w-4 group-data-[state=closed]:hidden group-data-[state=open]:block':
              true,
            'h-6 w-6': iconSize === 'md',
            'h-4 w-4': iconSize === 'sm',
          })}
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      )}
    </CollapsiblePrimitive.Trigger>
  );
});

CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
