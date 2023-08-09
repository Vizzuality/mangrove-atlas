import React from 'react';

import cn from 'lib/classnames';

import { mapSettingsAtom } from 'store/map-settings';
import { activeCategoryAtom, useSetActiveCategory } from 'store/sidebar';

import { useRecoilState, useRecoilValue } from 'recoil';

import CATEGORY_OPTIONS from 'containers/sidebar/constants';

import { Dialog, DialogContent, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import CHART_SVG from 'svgs/sidebar/chart.svg?sprite';

const CategoryMobile = () => {
  const category = useRecoilValue(activeCategoryAtom);
  const setCategory = useSetActiveCategory();
  const [mapSettings, setMapSettings] = useRecoilState(mapSettingsAtom);

  const handleClick = async (id) => {
    if (mapSettings) setMapSettings(false);
    await setCategory(id);
  };

  return (
    <div className="relative">
      <Dialog>
        <DialogTrigger asChild>
          <div className="h-10.5 relative flex w-10.5 cursor-pointer items-center justify-center">
            <Icon
              icon={CHART_SVG}
              className="mt-1 h-8 w-8 rounded-full fill-current stroke-none text-white"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="scroll-y h-fit translate-y-1/3 rounded-3xl bg-transparent font-sans">
          <h3 className="mb-1 text-center text-xs font-semibold text-white">Categories</h3>
          <div className="space-y-6 rounded-[30px] bg-white p-2.5 pr-4 text-2lg font-light">
            {CATEGORY_OPTIONS.map(({ id, label, icon }) => (
              <button
                key={id}
                className="group flex cursor-pointer items-center space-x-3"
                onClick={() => handleClick(id)}
              >
                <div
                  className={cn({
                    'h-10.5 flex w-10.5 items-center justify-center': true,
                  })}
                >
                  <Icon
                    icon={icon}
                    className={cn({
                      'h-11 w-12 rounded-full stroke-none p-1': true,
                      'bg-brand-800 fill-current text-white': category === id,
                      'fill-current text-brand-800 group-hover:bg-brand-800/15': category !== id,
                    })}
                  />
                </div>
                <p className="whitespace-nowrap">{label}</p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <div className="-mt-0.5 w-full font-sans text-xxs text-white">Categories</div>
    </div>
  );
};

export default CategoryMobile;
