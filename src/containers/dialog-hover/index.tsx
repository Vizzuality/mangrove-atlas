/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import cx from 'classnames';

import Icon from 'components/icon';

import { WIDGET_OPTIONS } from './constants';

interface DialogHoverPros {
  className?: string;
  isOpen: boolean;
  setIsOpen: (boolean) => void;
}
const DialogHoverComponent = ({ className, isOpen, setIsOpen }: DialogHoverPros) => {
  const [category, setCategory] = useState('summary');

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content
          onMouseLeave={() => setIsOpen(false)}
          className={cx({
            'fixed left-2 z-20 rounded-[30px] bg-white p-1.5 pr-4 focus:outline-none': true,
            [className]: !!className,
          })}
        >
          <Dialog.Description className="text-black/85 space-y-4 font-sans text-[19px] font-light">
            {WIDGET_OPTIONS.map(({ id, label, icon }) => (
              <button
                key={id}
                className="flex cursor-pointer items-center space-x-3"
                onClick={() => setCategory(id)}
              >
                <div
                  className={cx({
                    'flex h-12 w-12 items-center justify-center rounded-full bg-white': true,
                    'bg-brand-800': category === id,
                  })}
                >
                  <Icon
                    icon={icon}
                    className={cx({
                      'h-8 w-8': true,
                      'fill-white stroke-white': category === id,
                      'fill-brand-800 stroke-brand-800': category !== id,
                    })}
                  />
                </div>
                <p>{label}</p>
              </button>
            ))}
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogHoverComponent;
