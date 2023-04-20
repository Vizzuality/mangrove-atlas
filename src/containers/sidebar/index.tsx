/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from 'react';

import cn from 'lib/classnames';

import { CATEGORY_OPTIONS } from 'containers/sidebar/constants';
import HoverMenu from 'containers/sidebar/hover-menu';
import Menu from 'containers/sidebar/menu';
import Place from 'containers/sidebar/place';

import Icon from 'components/icon';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="absolute top-0 left-0 z-10 flex h-screen w-[80px] flex-col items-start justify-start space-y-5 bg-brand-600 p-2.5 py-20">
      <div>
        <Menu />
      </div>

      <Place />

      <div className="flex flex-col text-center">
        <div className="w-full py-2 font-sans text-xxs leading-[10px] text-white">Category</div>
        <div
          className="flex w-[60px] flex-col items-center justify-center space-y-4 rounded-full bg-white py-1 text-brand-800"
          onMouseEnter={() => setIsOpen(true)}
        >
          {CATEGORY_OPTIONS.map(({ id, icon }) => (
            <button
              key={id}
              className={cn({
                'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full': true,
              })}
            >
              <Icon icon={icon} className="h-8 w-8 text-brand-800" />
            </button>
          ))}
        </div>
        <HoverMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
};

export default Sidebar;
