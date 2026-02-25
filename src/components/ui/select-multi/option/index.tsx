import { Listbox } from '@headlessui/react';
import cx from 'classnames';

import { Checkbox, CheckboxIndicator } from '@/components/ui/checkbox';
import CHECK_SVG from '@/svgs/ui/check-light';

import THEME from '../constants/theme';

interface OptionProps {
  opt: {
    color: string;
    disabled: boolean;
    group: number;
    id: number;
    label: string;
    parentColor: string;
    parentId: number;
    parentLabel: string;
    value: number;
  };
  theme: 'default';
}
export const Option = ({ opt, theme }: OptionProps) => {
  return (
    <Listbox.Option
      key={opt.value}
      value={opt.value}
      disabled={opt.disabled}
      className="pointer-events-auto"
    >
      {({ active: a, selected: s, disabled: d }) => (
        <div
          className={cx({
            'flex cursor-pointer items-start space-x-2 px-5 py-2 select-none': true,
            [THEME[theme].item.base]: true,
            [THEME[theme].item.active]: a,
            [THEME[theme].item.selected]: s,
            [THEME[theme].item.disabled]: d,
          })}
        >
          <Checkbox className="h-4 w-4 cursor-pointer" checked={s}>
            <CheckboxIndicator>
              <CHECK_SVG
                className="fill-current fill-brand-800/70 h-2.5 w-2.5"
                role="img"
                title="Checkmark"
              />
            </CheckboxIndicator>
          </Checkbox>

          <span
            className={cx({
              'line-clamp-2 block': true,
            })}
          >
            {opt.label}
          </span>
        </div>
      )}
    </Listbox.Option>
  );
};
