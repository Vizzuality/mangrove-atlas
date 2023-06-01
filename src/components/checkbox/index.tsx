import React from 'react';

import cn from 'lib/classnames';

import * as CheckboxRadix from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

const CheckboxRoot = ({ className, children, ...props }) => (
  <CheckboxRadix.Root className={className} {...props}>
    <div className="shadow-blackA7 hover:bg-violet3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px_black]">
      {children}
    </div>
  </CheckboxRadix.Root>
);

const CheckboxIndicator = ({ className, children, ...props }) => (
  <CheckboxRadix.Indicator className={className} {...props}>
    {children}

    {!children && <CheckIcon />}
  </CheckboxRadix.Indicator>
);

const CheckboxLabel = ({ className, children }) => (
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

const Checkbox = ({ children, className, props }) => (
  <form {...props}>
    <div className={cn({ 'flex w-[500px] items-center': true, [className]: !!className })}>
      {children}
    </div>
  </form>
);

CheckboxRoot.displayName = CheckboxRadix.Root.displayName;
CheckboxIndicator.displayName = CheckboxRadix.Indicator.displayName;
CheckboxLabel.displayName = 'CheckboxLabel';
Checkbox.displayName = 'Checkbox';

export { CheckboxRoot, CheckboxIndicator, CheckboxLabel, Checkbox };
