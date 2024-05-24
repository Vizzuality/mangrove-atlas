import React, { ReactNode } from 'react';

import cn from 'lib/classnames';

import * as SwitchRadix from '@radix-ui/react-switch';

type WrapperProps = Readonly<{
  'data-testid'?: string;
  id: string;
  children: ReactNode;
  className?: string;
}>;

interface SwitchThumbProps extends SwitchRadix.SwitchThumbProps {
  icon?: React.ReactNode;
}

const SwitchRoot = ({ className, children, ...props }: SwitchRadix.SwitchProps) => (
  <SwitchRadix.Root
    role="button"
    aria-label="Toggle component"
    className={cn({
      'relative h-7.5 w-12 cursor-pointer rounded-full border-2 border-brand-800 border-opacity-20 bg-white outline-none data-[state=checked]:bg-brand-800':
        true,
      [className]: !!className,
    })}
    {...props}
  >
    {children}
  </SwitchRadix.Root>
);

const SwitchThumb = ({ className, icon }: SwitchThumbProps) => (
  <SwitchRadix.Thumb
    className={cn({
      'duration-400 block h-5 w-5 translate-x-0.5 rounded-full bg-brand-800 text-white transition-transform will-change-transform data-[state=checked]:translate-x-[19px] data-[state=checked]:bg-white data-[state=checked]:text-brand-800':
        true,
      [className]: !!className,
    })}
  >
    {icon && (
      <div className="leading-0 flex h-5 items-center justify-center text-sm font-bold ">?</div>
    )}
  </SwitchRadix.Thumb>
);

const SwitchWrapper = ({ id, children, className }: WrapperProps) => (
  <div className="flex items-center">
    <label
      className={cn({
        'sr-only pr-[15px] text-[15px] leading-none text-white': true,
        [className]: !!className,
      })}
      htmlFor={id}
    >
      {id}
    </label>
    {children}
  </div>
);
SwitchRoot.displayName = SwitchRadix.Root.displayName;
SwitchThumb.displayName = SwitchRadix.Thumb.displayName;

export { SwitchThumb, SwitchRoot, SwitchWrapper };
