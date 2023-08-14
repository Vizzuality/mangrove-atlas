import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import cn from 'lib/classnames';

import { Listbox } from '@headlessui/react';
import { Float } from '@headlessui-float/react';

import Icon from 'components/icon';
import Loading from 'components/loading';

import ARROW_SVG from 'svgs/ui/arrow.svg?sprite';

import THEME from './constants/theme';
import { Option } from './option';
import type { MultiSelectProps } from './types';

export const Select: FC<MultiSelectProps> = (props: MultiSelectProps) => {
  const {
    batchSelectionActive = false,
    batchSelectionLabel = 'Select all',
    clearSelectionActive = false,
    clearSelectionLabel = 'Clear all',
    disabled = false,
    options,
    groups,
    loading,
    size = 'base',
    theme = 'default',
    state = 'none',
    values,
    onChange,
    name,
  } = props;

  const initialValues = values || [];
  const [selected, setSelected] = useState(initialValues);
  const OPTIONS_ENABLED = useMemo(() => {
    if (!options) return [];
    return options.filter((o) => !o.disabled);
  }, [options]);

  useEffect(() => {
    if (values) {
      setSelected(values);
    }
  }, [values]);

  const handleSelect = useCallback(
    (v) => {
      setSelected(v);
      if (onChange) {
        onChange(v);
      }
    },
    [onChange]
  );

  const handleSelectAll = useCallback(
    (e) => {
      e.stopPropagation();
      const allOptions = OPTIONS_ENABLED.map((o) => o.value);
      setSelected(allOptions);
      if (onChange) {
        onChange(allOptions);
      }
    },
    [onChange, OPTIONS_ENABLED]
  );

  const handleClearAll = useCallback(
    (e) => {
      e.stopPropagation();
      setSelected([]);
      if (onChange) {
        onChange([]);
      }
    },
    [onChange]
  );

  return (
    <div
      className={cn({
        'w-full': true,
        [THEME[theme].container]: true,
      })}
    >
      <Listbox
        as="div"
        className="space-y-1"
        disabled={disabled}
        value={selected}
        multiple
        onChange={handleSelect}
      >
        {({ open }) => (
          <>
            <Float
              key={open ? 'open' : 'closed'}
              adaptiveWidth
              placement="bottom-start"
              portal
              flip
              enter="transition duration-200 ease-out"
              enterFrom="scale-95 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="transition duration-150 ease-in"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-95 opacity-0"
            >
              <Listbox.Button
                className={cn({
                  'flex w-full items-center justify-between': true,
                  [THEME.sizes[size]]: true,
                  [THEME[theme].button.base]: true,
                  [THEME[theme].button.states.disabled]: disabled,
                  [THEME[theme].button.states.valid]: state === 'valid',
                  [THEME[theme].button.states.error]: state === 'error',
                })}
              >
                <p className="flex w-full items-center space-x-2">
                  <span className="first-letter:uppercase">{name}</span>
                  {!!selected.length && (
                    <span className="rounded-full bg-brand-800 px-2 text-xxs text-white">
                      {selected.length}
                    </span>
                  )}
                </p>
                <Icon
                  icon={ARROW_SVG}
                  className={cn({
                    'h-3.5 w-3.5 shrink-0 fill-current text-brand-800': true,
                    'rotate-180 delay-200': open,
                  })}
                  description="Arrow"
                />
                {/* <span className="pointer-events-none relative flex items-center space-x-2">
                  <Loading
                    visible={loading}
                    className={THEME[theme].loading}
                    iconClassName="w-3 h-3 shrink-0"
                  />

                  {} */}

                {/* <Icon
                    icon={open ? CHEVRON_UP_SVG : CHEVRON_DOWN_SVG}
                    className={cn({
                      'h-3 w-3 shrink-0': true,
                    })}
                  /> */}
                {/* </span> */}
              </Listbox.Button>

              <Listbox.Options
                static
                className={cn({
                  'pointer-events-auto max-h-60 overflow-y-auto text-base leading-6 focus:outline-none':
                    true,
                  [THEME[theme].menu]: true,
                })}
              >
                <div
                  className={cn({
                    'sticky top-0 z-10 flex space-x-5 px-5 text-sm': true,
                    [THEME[theme].menuHeader]: true,
                  })}
                >
                  {batchSelectionActive && (
                    <button
                      className="text-grey-20 whitespace-nowrap py-2 text-left underline"
                      type="button"
                      onClick={handleSelectAll}
                    >
                      {batchSelectionLabel}
                    </button>
                  )}

                  {clearSelectionActive && (
                    <button
                      className="whitespace-nowrap py-2 text-left underline"
                      type="button"
                      onClick={handleClearAll}
                    >
                      {selected.length < 1 && clearSelectionLabel}
                      {selected.length >= 1 &&
                        selected.length !== OPTIONS_ENABLED.length &&
                        selected.length < OPTIONS_ENABLED.length &&
                        `${clearSelectionLabel} (${selected.length} Selected)`}
                      {(selected.length === OPTIONS_ENABLED.length ||
                        selected.length > OPTIONS_ENABLED.length) &&
                        `${clearSelectionLabel} (All selected)`}
                    </button>
                  )}
                </div>

                {groups &&
                  groups.map((g) => {
                    const groupOptions = options.filter((o) => o.group === g.value);

                    return (
                      <div key={g.value}>
                        <h3 className="py-2 pl-3 text-xs font-bold">{g.label}</h3>
                        {groupOptions.map((opt) => {
                          return <Option key={opt.value} opt={opt} theme={theme} />;
                        })}
                      </div>
                    );
                  })}

                {!groups &&
                  options.map((opt) => {
                    return <Option key={opt.value} opt={opt} theme={theme} />;
                  })}
              </Listbox.Options>
            </Float>
          </>
        )}
      </Listbox>
    </div>
  );
};

export default Select;
