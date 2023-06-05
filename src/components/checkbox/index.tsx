import React, { ReactNode } from 'react';

import cn from 'lib/classnames';

import * as CheckboxRadix from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

type CheckboxRootProps = {
  className?: string;
  children?: ReactNode | string | number;
  onCheckedChange?: (checked: CheckboxRadix.CheckedState) => void;
  name?: string;
  value?: string | number;
  props?: any;
  checked?: boolean;
};

type CheckboxProps = {
  className?: string;
  children?: ReactNode | string | number;
  props?: any;
};

const CheckboxRoot = ({ className, children, ...props }: CheckboxRootProps) => (
  <CheckboxRadix.Root className={className} {...props}>
    <div className="hover:bg-violet3 flex h-[20px] w-[20px] appearance-none items-center justify-center rounded-[4px] border border-brand-800/70 bg-white outline-none focus:shadow-[0_0_0_2px_black]">
      {children}
    </div>
  </CheckboxRadix.Root>
);

const CheckboxIndicator = ({ className, children, ...props }: CheckboxProps) => (
  <CheckboxRadix.Indicator className={className} {...props}>
    {children}

    {!children && <CheckIcon />}
  </CheckboxRadix.Indicator>
);

const CheckboxLabel = ({
  className,
  children,
}: {
  className: string;
  children?: ReactNode | string | number;
}) => (
  <label
    className={cn({
      'pl-[15px] text-[15px] leading-none text-white': true,
      [className]: !!className,
    })}
    htmlFor="c1"
  >
    {children}
  </label>
);

const Checkbox = ({ children, className, props }: CheckboxProps) => (
  <form {...props} className=" p-5">
    <div className={cn({ 'flex items-start': true, [className]: !!className })}>{children}</div>
  </form>
);

CheckboxRoot.displayName = CheckboxRadix.Root.displayName;
CheckboxIndicator.displayName = CheckboxRadix.Indicator.displayName;
CheckboxLabel.displayName = 'CheckboxLabel';
Checkbox.displayName = 'Checkbox';

export { CheckboxRoot, CheckboxIndicator, CheckboxLabel, Checkbox };
