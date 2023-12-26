import cn from 'lib/classnames';

import * as RadioGroup from '@radix-ui/react-radio-group';

import type { RadioOption } from '../types';

const RadioGroupItem = ({ option, className }: { option: RadioOption; className?: string }) => (
  <div className="flex items-center ">
    <RadioGroup.Item
      className={cn({
        'h-5 w-5 items-center justify-center rounded-full border-2 border-brand-400/20 bg-white data-[state=checked]:border-brand-800':
          true,
        [className]: !!className,
      })}
      value={option.value}
      id={option.value}
    >
      <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-[10px] after:w-[10px] after:rounded-full after:bg-brand-400 data-[state=checked]:after:bg-brand-800" />
    </RadioGroup.Item>
    <label className="cursor-pointer pl-3 text-sm leading-none" htmlFor={option.value}>
      {option.label}
    </label>
  </div>
);

export default RadioGroupItem;
