'use client';

import * as React from 'react';

import cn from '@/lib/classnames';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';

function Tabs({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn('group/tabs flex gap-2 data-[orientation=horizontal]:flex-col', className)}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  'rounded-lg p-[3px] group-data-horizontal/tabs:h-8 data-[variant=line]:rounded-none group/tabs-list text-black/60 inline-flex w-fit items-center justify-center group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        line: 'gap-1 bg-transparent',
        pill: 'bg-brand-800 gap-2.5 rounded-[32px] p-1 shadow-[0px_4px_6px_rgba(0,60,57,0.15)] group-data-horizontal/tabs:h-[38px]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function TabsList({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Brand-color-dark,#00857F)] disabled:pointer-events-none disabled:opacity-5',
  {
    variants: {
      variant: {
        default:
          'rounded-[16px] border-2 border-black/15 text-sm font-semibold leading-[20px] text-black p-[15px] data-[state=active]:border-brand-800 data-[state=active]:text-brand-800 hover:border-brand-800 hover:text-brand-800',
        pill: 'h-[30px] w-[92px] gap-1 rounded-full py-2 text-[10px] font-bold leading-[20px] text-white data-[state=active]:bg-white data-[state=active]:text-brand-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function TabsTrigger({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & VariantProps<typeof tabsTriggerVariants>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 text-sm outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
