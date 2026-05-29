import cn from '@/lib/classnames';

import * as RadioGroup from '@radix-ui/react-radio-group';
import { CgRadioCheck } from 'react-icons/cg';

const RadioCheckIcon = CgRadioCheck as unknown as (p: IconBaseProps) => JSX.Element;

import { IconBaseProps } from 'react-icons/lib';

import type { RadioOption } from '../types';

const RadioGroupItem = ({
  option,
  className,
  label = true,
}: {
  option: RadioOption;
  className?: string;
  label?: boolean;
}) => (
  <div className="flex items-center space-x-4">
    <RadioGroup.Item
      className={cn(className, {
        'group inline-flex h-3 w-3 shrink-0 cursor-pointer items-center justify-center rounded-full':
          true,
      })}
      value={option.value}
      id={option.value}
    >
      <span
        aria-hidden="true"
        className="group-data-[state=checked]:border-brand-800 flex h-3 w-3 items-center justify-center rounded-full border border-black/85 group-data-[state=checked]:border-4"
      >
        <RadioGroup.Indicator className="flex items-center justify-center">
          <RadioCheckIcon className="text-brand-800 h-2.5 w-2.5" />
        </RadioGroup.Indicator>
      </span>
    </RadioGroup.Item>
    {label && (
      <label
        className="font-sm text-brand-800 m-0 cursor-pointer text-sm leading-none font-semibold"
        htmlFor={option.value}
      >
        {option.label}
      </label>
    )}
  </div>
);

export default RadioGroupItem;
