import React from 'react';

import * as RadioGroup from '@radix-ui/react-radio-group';
import type { RadioGroupProps } from '@radix-ui/react-radio-group';

import RadioItem from './radio-group-item';
import type { RadioOption } from './types';

export interface RadioGroupDemoProps extends RadioGroupProps {
  options: RadioOption[];
}

const RadioGroupDemo = ({ options, ...props }: RadioGroupDemoProps) => (
  <RadioGroup.Root className="space-y flex flex-col" {...props}>
    {options.map((option) => (
      <div key={option.value} className="flex items-center">
        <RadioItem option={option} />
      </div>
    ))}
  </RadioGroup.Root>
);

export default RadioGroupDemo;
