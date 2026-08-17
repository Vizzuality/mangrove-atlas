import cn from '@/lib/classnames';

import * as RadioGroup from '@radix-ui/react-radio-group';
import { CgRadioCheck } from 'react-icons/cg';

const RadioCheckIcon = CgRadioCheck as unknown as (p: IconBaseProps) => JSX.Element;

import { IconBaseProps } from 'react-icons/lib';

import type { RadioOption } from '../types';

const RadioGroupItem = ({
  option,
  className,
  labelClassName,
  label = true,
  ...props
}: {
  option: RadioOption;
  className?: string;
  labelClassName?: string;
  label?: boolean;
} & Omit<RadioGroup.RadioGroupItemProps, 'value' | 'id'>) => (
  <RadioGroup.Item
    className={cn(className, {
      'group flex cursor-pointer items-center space-x-4': true,
    })}
    value={option.value}
    id={option.value}
    aria-label={label ? undefined : option.label}
    {...props}
  >
    <span
      aria-hidden="true"
      className="group-data-[state=checked]:border-brand-800 flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-black/85 group-data-[state=checked]:border-4"
    >
      <RadioGroup.Indicator className="flex items-center justify-center">
        <RadioCheckIcon className="text-brand-800 h-2.5 w-2.5" aria-hidden="true" />
      </RadioGroup.Indicator>
    </span>
    {label && (
      <span
        className={
          labelClassName ?? 'font-sm text-brand-800 m-0 text-sm leading-none font-semibold'
        }
      >
        {option.label}
      </span>
    )}
  </RadioGroup.Item>
);

export default RadioGroupItem;
