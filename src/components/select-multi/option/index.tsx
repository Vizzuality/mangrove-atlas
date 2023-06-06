import { Listbox } from '@headlessui/react';
import cx from 'classnames';

import { Checkbox } from 'components/checkbox';

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
            'flex cursor-pointer select-none items-start space-x-2 py-2 pl-5 pr-4': true,
            [THEME[theme].item.base]: true,
            [THEME[theme].item.active]: a,
            [THEME[theme].item.selected]: s,
            [THEME[theme].item.disabled]: d,
          })}
        >
          <Checkbox className="cursor-pointer" checked={s} />

          <span
            className={cx({
              'block line-clamp-2': true,
            })}
          >
            {opt.label}
          </span>
        </div>
      )}
    </Listbox.Option>
  );
};
