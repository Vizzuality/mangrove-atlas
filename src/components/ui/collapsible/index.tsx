'use client';

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';

import cn from 'lib/classnames';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { HiMinus, HiPlus } from 'react-icons/hi';

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> & {
    inset?: boolean;
    children?: React.ReactNode;
    className?: string;
    showExpandIcon?: boolean;
    isOpen?: boolean;
  }
>(({ className, children, showExpandIcon = true, ...props }, ref) => {
  return (
    <CollapsiblePrimitive.Trigger
      ref={ref}
      className={cn(
        'group flex w-full items-center justify-between whitespace-nowrap p-6 text-black/85',
        className
      )}
      {...props}
    >
      {children}

      {showExpandIcon && (
        <HiMinus className="h-6 w-6 text-brand-800 group-data-[state=open]:block group-data-[state=closed]:hidden" />
      )}

      {showExpandIcon && (
        <HiPlus className="h-6 w-6 text-brand-800 group-data-[state=closed]:block group-data-[state=open]:hidden" />
      )}
    </CollapsiblePrimitive.Trigger>
  );
});

CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
