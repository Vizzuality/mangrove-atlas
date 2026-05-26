import { ComponentProps, CSSProperties } from 'react';

import * as SelectPrimitive from '@radix-ui/react-select';
import cn from 'classnames';

const Select = SelectPrimitive.Root;

function SelectValue({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value className={cn(className, 'truncate text-3xl')} {...props}>
      {children}
    </SelectPrimitive.Value>
  );
}

function SelectIcon({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Icon>) {
  return (
    <SelectPrimitive.Icon className={cn(className, 'text-muted-foreground')} {...props}>
      {children}
    </SelectPrimitive.Icon>
  );
}

function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        className,
        'border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-3xl px-3 py-0 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
      )}
      {...props}
    >
      {children}
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  viewportClassName,
  viewportStyle,
  children,
  position = 'popper',
  ...props
}: ComponentProps<typeof SelectPrimitive.Content> & {
  viewportClassName?: string;
  viewportStyle?: CSSProperties;
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          'shadow-medium animate-in fade-in-70 relative -top-11 z-50 w-(--radix-select-trigger-width) duration-300',
          position === 'popper' && 'translate-y-1',
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport
          data-slot="select-viewport"
          style={viewportStyle}
          className={cn('p-1', position === 'popper' && 'w-full', viewportClassName)}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'focus:bg-accent focus:text-accent-foreground relative w-full cursor-pointer items-center justify-between outline-none',
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectIcon };
