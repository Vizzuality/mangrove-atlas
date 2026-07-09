'use client';

import { useState } from 'react';

import cn from '@/lib/classnames';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import ARROW_SVG from '@/svgs/ui/arrow';
import CHECK_SVG from '@/svgs/ui/check-light';

type RoleOption = { label: string; value: string };

type RolesSelectProps = {
  id?: string;
  placeholder: string;
  options: RoleOption[];
  values: string[];
  onChange: (values: string[]) => void;
};

const RolesSelect = ({ id, placeholder, options, values, onChange }: RolesSelectProps) => {
  const [open, setOpen] = useState(false);

  const selectedLabels = options.filter((o) => values.includes(o.value)).map((o) => o.label);

  const toggle = (value: string) => {
    onChange(values.includes(value) ? values.filter((v) => v !== value) : [...values, value]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className="focus:border-brand-800 flex w-full cursor-pointer items-center justify-between space-x-4 rounded-[100px] border border-black/10 py-2 pr-2 pl-3 text-left text-sm focus:outline-none"
        >
          <span className={cn('truncate', { 'text-zinc-400': !selectedLabels.length })}>
            {selectedLabels.length ? selectedLabels.join(', ') : placeholder}
          </span>
          <ARROW_SVG
            className={cn('text-brand-800 h-3.5 w-3.5 shrink-0 fill-current', {
              'rotate-180': open,
            })}
            aria-hidden="true"
          />
        </button>
      </PopoverTrigger>
      {/* z-[70] overrides the default popover z-50 so the dropdown renders
          above the menu Dialog (portal wrapper z-60) on the profile page —
          otherwise it paints behind the dialog panel and looks empty. */}
      <PopoverContent
        align="start"
        className="z-[70] max-h-60 w-[var(--radix-popover-trigger-width)] space-y-0 rounded-2xl p-2"
      >
        <div role="listbox" aria-multiselectable="true">
          {options.map((option) => {
            const checked = values.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={checked}
                onClick={() => toggle(option.value)}
                className="flex w-full cursor-pointer items-center space-x-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-black/5"
              >
                {/* Visual checkbox only (span, not the Radix Checkbox): the row is
                  already a <button>, and a nested interactive element is invalid
                  HTML and breaks hydration. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'border-brand-800/50 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border-2',
                    { 'border-4': checked }
                  )}
                >
                  {checked && <CHECK_SVG className="fill-brand-800/70 h-2.5 w-2.5 fill-current" />}
                </span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RolesSelect;
