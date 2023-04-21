/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from 'react';

import cn from 'lib/classnames';

import { menuCategoryAtom } from 'store/menu';

import { useSetRecoilState, useRecoilValue } from 'recoil';

import { CATEGORY_OPTIONS } from 'containers/sidebar/constants';

import { Dialog, DialogContent, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

const Category = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const category = useRecoilValue(menuCategoryAtom);
  const setCategory = useSetRecoilState(menuCategoryAtom);

  return (
    <div className="flex flex-col text-center">
      <div className="w-full py-2 font-sans text-xxs leading-[10px] text-white">Category</div>
      <div className="flex w-[60px] flex-col items-center justify-center space-y-4 rounded-full bg-white py-1 text-brand-800">
        <Dialog open={isOpen}>
          <DialogTrigger>
            <div
              className="flex w-[60px] flex-col items-center justify-center space-y-4 rounded-full bg-white py-1 text-brand-800"
              onMouseEnter={() => setIsOpen(true)}
            >
              {CATEGORY_OPTIONS.map(({ id, icon }) => (
                <div
                  key={id}
                  className={cn({
                    'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full': true,
                    'bg-brand-800': category === id,
                  })}
                >
                  <Icon
                    icon={icon}
                    className={cn({
                      'h-8 w-8 stroke-none': true,
                      'fill-current text-white': category === id,
                      'fill-current text-brand-800': category !== id,
                    })}
                  />
                </div>
              ))}
            </div>
          </DialogTrigger>
          <DialogContent
            onMouseLeave={() => setIsOpen(false)}
            className="text-black/85 fixed z-50 mt-56 w-[335px] rounded-[30px] bg-white p-1.5 pr-4 font-sans text-[19px] font-light focus:outline-none"
          >
            {CATEGORY_OPTIONS.map(({ id, label, icon }) => (
              <button
                key={id}
                className="flex cursor-pointer items-center space-x-3"
                onClick={() => setCategory(id)}
              >
                <div
                  className={cn({
                    'flex h-12 w-12 items-center justify-center rounded-full bg-white': true,
                    'bg-brand-800': category === id,
                  })}
                >
                  <Icon
                    icon={icon}
                    className={cn({
                      'h-8 w-8 stroke-none': true,
                      'fill-current text-white': category === id,
                      'fill-current text-brand-800': category !== id,
                    })}
                  />
                </div>
                <p className="whitespace-nowrap">{label}</p>
              </button>
            ))}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Category;
