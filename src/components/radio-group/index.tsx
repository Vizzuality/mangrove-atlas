import React from 'react';

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type { RadioGroupProps } from '@radix-ui/react-radio-group';

import RadioItem from './radio-group-item';
import type { RadioOption } from './types';

export interface RadioGroupDemoProps extends RadioGroupProps {
  options?: RadioOption[];
}

const RadioGroup = ({ options, children, ...props }: RadioGroupDemoProps) => (
  <RadioGroupPrimitive.Root className="space-y flex flex-col" {...props}>
    {!!options
      ? options.map((option) => (
          <div key={option.value}>
            <RadioItem option={option} />
          </div>
        ))
      : children}
  </RadioGroupPrimitive.Root>
);

export default RadioGroup;
