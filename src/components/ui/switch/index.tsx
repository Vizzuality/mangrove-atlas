import React, { ReactElement, ReactNode, cloneElement, isValidElement } from 'react';

import cn from '@/lib/classnames';

import * as SwitchRadix from '@radix-ui/react-switch';

type WrapperProps = Readonly<{
  'data-testid'?: string;
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
}>;

interface SwitchThumbProps extends SwitchRadix.SwitchThumbProps {
  icon?: React.ReactNode;
}

const SIZE = {
  root: {
    sm: 'h-6 w-10',
    md: 'h-[30px] w-[50px]',
  },
  thumb: {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
  },
};

const SwitchRoot = ({
  className,
  children,
  size = 'md',
  ...props
}: SwitchRadix.SwitchProps & {
  size?: 'sm' | 'md';
}) => (
  <SwitchRadix.Root
    className={cn(className, {
      'border-brand-800/20 data-[state=checked]:bg-brand-800 relative h-7.5 w-12 cursor-pointer rounded-full border-2 bg-transparent': true,
      [SIZE['root'][size]]: true,
    })}
    {...props}
  >
    {children}
  </SwitchRadix.Root>
);

const SwitchThumb = ({
  className,
  icon,
  size = 'md',
}: SwitchThumbProps & { size?: 'sm' | 'md' }) => (
  <SwitchRadix.Thumb
    className={cn(className, {
      'bg-brand-800 data-[state=checked]:text-brand-800 block h-5 w-5 translate-x-[3px] rounded-full text-white transition-transform duration-400 will-change-transform data-[state=checked]:translate-x-6 data-[state=checked]:bg-white': true,
      [SIZE['thumb'][size]]: true,
    })}
  >
    {icon && (
      <div className="flex h-5 items-center justify-center text-sm leading-0 font-bold">?</div>
    )}
  </SwitchRadix.Thumb>
);

const SwitchWrapper = ({ id, label, children, className }: WrapperProps) => {
  const labelId = `${id}-label`;
  const childWithId = isValidElement(children)
    ? cloneElement(children as ReactElement<{ id?: string; 'aria-labelledby'?: string }>, {
        id,
        'aria-labelledby': labelId,
      })
    : children;
  return (
    <div className="flex items-center">
      {/* Not a <label htmlFor>: Radix renders Switch.Root as a <button>, which
          is not a labelable element, so htmlFor bound to nothing. The name is
          carried by aria-labelledby on the switch itself (see childWithId). */}
      <span
        id={labelId}
        className={cn(className, {
          'sr-only pr-[15px] text-[15px] leading-none text-white': true,
        })}
      >
        {label}
      </span>
      {childWithId}
    </div>
  );
};

SwitchRoot.displayName = SwitchRadix.Root.displayName;
SwitchThumb.displayName = SwitchRadix.Thumb.displayName;

export { SwitchRoot, SwitchThumb, SwitchWrapper };
