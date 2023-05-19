import React, { useState } from 'react';

import cn from 'lib/classnames';

import { activeCategoryAtom } from 'store/sidebar';

import { useSetRecoilState, useRecoilValue } from 'recoil';

import { CATEGORY_OPTIONS } from 'containers/sidebar/constants';

import { Dialog, DialogContent, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import CHART_SVG from 'svgs/sidebar/chart.svg?sprite';

const CategoryMobile = () => {
  const category = useRecoilValue(activeCategoryAtom);
  const setCategory = useSetRecoilState(activeCategoryAtom);

  return (
    <div className="relative">
      <Dialog>
        <DialogTrigger>
          <div className="h-10.5 relative flex w-10.5 cursor-pointer items-center justify-center">
            <Icon
              icon={CHART_SVG}
              className="mt-1 h-8 w-8 rounded-full fill-current stroke-none text-white"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="left-1/12 fixed top-1/2 z-50 w-5/6 -translate-y-1/2 rounded-[30px] p-1.5  pr-4 font-sans text-[19px] font-light text-black/85 focus:outline-none">
          {CATEGORY_OPTIONS.map(({ id, label, icon }) => (
            <button
              key={id}
              className="flex cursor-pointer items-center space-x-3"
              onClick={() => setCategory(id)}
            >
              <div
                className={cn({
                  'h-10.5 flex w-10.5 items-center justify-center': true,
                })}
              >
                <Icon
                  icon={icon}
                  className={cn({
                    'h-8 w-8 stroke-none': true,
                    'rounded-full bg-brand-800 fill-current text-white': category === id,
                    'fill-current text-brand-800': category !== id,
                  })}
                />
              </div>
              <p className="whitespace-nowrap">{label}</p>
            </button>
          ))}
        </DialogContent>
      </Dialog>

      <div className="-mt-0.5 w-full font-sans text-xxs text-white">Category</div>
    </div>
  );
};

export default CategoryMobile;
