'use client';

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';

import cn from 'lib/classnames';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

import { HiMinus, HiPlus, HiChevronDown, HiChevronUp } from 'react-icons/hi';

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
        'group flex w-full items-center justify-between whitespace-nowrap p-6 text-black/85',
        className
      )}
      {...props}
    >
      {children}

      {iconType === 'plus-minus' && (
        <HiMinus
          className={cn({
            'h-6 w-6 text-brand-800 group-data-[state=open]:block group-data-[state=closed]:hidden':
              true,
            'h-6 w-6': iconSize === 'md',
            'h-4 w-4': iconSize === 'sm',
          })}
        />
      )}

      {iconType === 'plus-minus' && (
        <HiPlus
          className={cn({
            'h-6 w-6 text-brand-800 group-data-[state=closed]:block group-data-[state=open]:hidden':
              true,
            'h-6 w-6': iconSize === 'md',
            'h-4 w-4': iconSize === 'sm',
          })}
        />
      )}

      {iconType === 'arrow' && (
        <HiChevronDown
          className={cn({
            'h-4 w-4 text-brand-800 group-data-[state=closed]:block group-data-[state=open]:hidden':
              true,
            'h-6 w-6': iconSize === 'md',
            'h-4 w-4': iconSize === 'sm',
          })}
        />
      )}

      {iconType === 'arrow' && (
        <HiChevronUp
          className={cn({
            'h-4 w-4 text-brand-800 group-data-[state=open]:block group-data-[state=closed]:hidden':
              true,
            'h-6 w-6': iconSize === 'md',
            'h-4 w-4': iconSize === 'sm',
          })}
        />
      )}
    </CollapsiblePrimitive.Trigger>
  );
});

CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
