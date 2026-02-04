import { forwardRef, ElementRef, ComponentPropsWithoutRef, HTMLAttributes } from 'react';

import * as SelectPrimitive from '@radix-ui/react-select';
import cn from 'classnames';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = forwardRef<
  ElementRef<typeof SelectPrimitive.Value>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Value
    ref={ref}
    className={cn({ 'truncate text-3xl': true, [className]: !!className })}
    {...props}
  >
    {children}
  </SelectPrimitive.Value>
));

SelectValue.displayName = SelectPrimitive.Value.displayName;

const SelectIcon = forwardRef<
  ElementRef<typeof SelectPrimitive.Icon>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Icon>
>(({ className, children, ...props }) => (
  <SelectPrimitive.Icon
    className={cn({ 'text-muted-foreground': true, [className]: !!className })}
    {...props}
  >
    {children}
  </SelectPrimitive.Icon>
));

SelectIcon.displayName = SelectPrimitive.Icon.displayName;

const SelectTrigger = forwardRef<
  ElementRef<typeof SelectPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn({
      'border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-3xl px-3 py-0 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50':
        true,
      [className]: !!className,
    })}
    {...props}
  >
    {children}
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = forwardRef<
  ElementRef<typeof SelectPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'shadow-medium animate-in fade-in-70 relative -top-11 z-50 w-[var(--radix-select-trigger-width)] duration-300',
        position === 'popper' && 'translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className={cn('p-1', position === 'popper' && 'w-full')}>
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = forwardRef<
  ElementRef<typeof SelectPrimitive.Label>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pr-2 pl-8 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = forwardRef<
  ElementRef<typeof SelectPrimitive.Item>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative w-full cursor-pointer items-center justify-between outline-none',
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = forwardRef<
  ElementRef<typeof SelectPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('bg-muted -mx-1 my-1 h-px', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectIcon,
};
