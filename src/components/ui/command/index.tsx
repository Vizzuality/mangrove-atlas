import { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react';

import cn from '@/lib/classnames';

import { Command as CommandPrimitive } from 'cmdk';

const Command = forwardRef<
  ElementRef<typeof CommandPrimitive>,
  ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(className, {
      'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md':
        true,
    })}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandSeparator = forwardRef<
  ElementRef<typeof CommandPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator ref={ref} className={cn(className)} {...props} />
));

CommandSeparator.displayName = CommandPrimitive.displayName;

const CommandInput = forwardRef<
  ElementRef<typeof CommandPrimitive.Input>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center p-0.5" cmdk-input-wrapper="">
    <CommandPrimitive.Input
      ref={ref}
      {...props}
      className={cn(className, {
        'placeholder:text-foreground-muted focus:border-brand-800 flex h-11 w-full rounded-md border-2 bg-transparent py-3 text-2xl outline-none placeholder:text-2xl focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50':
          true,
      })}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = forwardRef<
  ElementRef<typeof CommandPrimitive.List>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List ref={ref} className={cn(className)} {...props} />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = forwardRef<
  ElementRef<typeof CommandPrimitive.Empty>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = forwardRef<
  ElementRef<typeof CommandPrimitive.Group>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(className, {
      'text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium':
        true,
    })}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandItem = forwardRef<
  ElementRef<typeof CommandPrimitive.Item>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(className, {
      'aria-selected:bg-accent aria-selected:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50':
        true,
    })}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem };
