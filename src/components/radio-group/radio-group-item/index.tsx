import cn from 'lib/classnames';

import * as RadioGroup from '@radix-ui/react-radio-group';
import { CgRadioCheck } from 'react-icons/cg';

import type { RadioOption } from '../types';

const RadioGroupItem = ({ option, className }: { option: RadioOption; className?: string }) => (
  <div className="flex items-center space-x-4">
    <RadioGroup.Item
      className={cn({
        'flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-black/85 data-[state=checked]:border-4 data-[state=checked]:border-brand-800':
          true,
        [className]: !!className,
      })}
      value={option.value}
      id={option.value}
    >
      <RadioGroup.Indicator className="flex items-center justify-center">
        <CgRadioCheck className="h-2.5 w-2.5 text-brand-800" />
      </RadioGroup.Indicator>
    </RadioGroup.Item>
  </div>
);

export default RadioGroupItem;
