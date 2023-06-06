import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Listbox } from '@headlessui/react';
import { Float } from '@headlessui-float/react';
import cx from 'classnames';

import Icon from 'components/icon';
import Loading from 'components/loading';

// import CHEVRON_DOWN_SVG from 'svgs/ui/arrow-down.svg?sprite';
// import CHEVRON_UP_SVG from 'svgs/ui/arrow-up.svg?sprite';
// import CLOSE_SVG from 'svgs/ui/close.svg?sprite';

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
    placeholder = 'Select...',
    loading,
    size = 'base',
    theme = 'default',
    state = 'none',
    values,
    onChange,
  } = props;

  const initialValues = values || [];
  const [selected, setSelected] = useState(initialValues);

  const OPTIONS_ENABLED = useMemo(() => {
    if (!options) return [];
    return options.filter((o) => !o.disabled);
  }, [options]);

  const SELECTED = useMemo(() => {
    // if (loading) return 'Loading...';

    if (!selected.length) return placeholder || 'Select items';

    // if (selected.length === options.length) return placeholder;

    if (selected.length === 1) {
      const option = options.find((o) => o.value === selected[0]);
      if (option) return option.label;
      return null;
    }

    if (selected.length === OPTIONS_ENABLED.length || selected.length > OPTIONS_ENABLED.length)
      return `All items selected`;

    if (selected.length > 1) return `Selected items (${selected.length})`;

    return null;
  }, [options, placeholder, selected, OPTIONS_ENABLED]);

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
      className={cx({
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
                className={cx({
                  [THEME.sizes[size]]: true,
                  [THEME[theme].button.base]: true,
                  [THEME[theme].button.states.disabled]: disabled,
                  [THEME[theme].button.states.valid]: state === 'valid',
                  [THEME[theme].button.states.error]: state === 'error',
                })}
              >
                <span
                  className={cx({
                    'block truncate': true,
                    [THEME[theme].selected]: !!selected.length,
                  })}
                >
                  {SELECTED}
                </span>
                <span className="pointer-events-none relative flex items-center space-x-2">
                  <Loading
                    visible={loading}
                    className={THEME[theme].loading}
                    iconClassName="w-3 h-3 shrink-0"
                  />

                  {!!selected.length && clearSelectionActive && (
                    <span className="pointer-events-auto" onClick={handleClearAll}>
                      {/* <Icon
                        icon={CLOSE_SVG}
                        className={cx({
                          'h-3.5 w-3.5 shrink-0': true,
                        })}
                      /> */}
                    </span>
                  )}

                  {/* <Icon
                    icon={open ? CHEVRON_UP_SVG : CHEVRON_DOWN_SVG}
                    className={cx({
                      'h-3 w-3 shrink-0': true,
                    })}
                  /> */}
                </span>
              </Listbox.Button>

              <Listbox.Options
                static
                className={cx({
                  'pointer-events-auto max-h-60 overflow-y-auto text-base leading-6 focus:outline-none':
                    true,
                  [THEME[theme].menu]: true,
                })}
              >
                <div
                  className={cx({
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
                        <h3 className="py-2 pl-5 text-xs font-bold">{g.label}</h3>
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
