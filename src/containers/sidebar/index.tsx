/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from 'react';

import cn from 'lib/classnames';

import HighlightedPlaces from 'containers/highlighted-places';
import HoverMenu from 'containers/hover-menu';
import LocationsList from 'containers/locations-list';

import Icon from 'components/icon';

import AREA_SVG from 'svgs/sidebar/area.svg?sprite';
import CHART_SVG from 'svgs/sidebar/chart.svg?sprite';
import GLASS_SVG from 'svgs/sidebar/glass.svg?sprite';
import GLOBE_SVG from 'svgs/sidebar/globe.svg?sprite';
import RELOAD_SVG from 'svgs/sidebar/reload.svg?sprite';
import STAR_SVG from 'svgs/sidebar/star.svg?sprite';
import SUN_SVG from 'svgs/sidebar/sun.svg?sprite';

import Menu from './menu';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="absolute top-0 left-0 z-10 flex h-screen w-[80px] flex-col items-start justify-start bg-brand-600 p-2.5 py-20">
      <Menu />

      <div className="flex flex-col text-center">
        <div className="w-full py-2 font-sans text-xxs leading-[10px] text-white">Place</div>
        <div className="flex w-[60px] flex-col items-center justify-center space-y-4 rounded-full bg-white py-1 text-brand-800">
          <button
            className={cn({
              'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full': true,
            })}
          >
            <Icon icon={GLOBE_SVG} className="h-8 w-8 fill-current text-brand-800" />
          </button>
          <button
            className={cn({
              'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full': true,
            })}
          >
            <Icon icon={GLASS_SVG} className="h-8 w-8 fill-current text-brand-800" />
          </button>
          <button
            className={cn({
              'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border': true,
            })}
          >
            <Icon icon={AREA_SVG} className="h-8 w-8 fill-current text-brand-800" />
          </button>
        </div>
      </div>

      <div className="flex flex-col text-center">
        <div className="w-full py-2 font-sans text-xxs leading-[10px] text-white">Category</div>
        <div
          className="flex w-[60px] flex-col items-center justify-center space-y-4 rounded-full bg-white py-1 text-brand-800"
          onMouseEnter={() => setIsOpen(true)}
        >
          <button
            className={cn({
              'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full': true,
            })}
          >
            <Icon icon={STAR_SVG} className="h-8 w-8 text-brand-800" />
          </button>
          <button
            className={cn({
              'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full': true,
            })}
          >
            <Icon icon={RELOAD_SVG} className="h-8 w-8 fill-current text-brand-800" />
          </button>
          <button
            className={cn({
              'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border': true,
            })}
          >
            <Icon icon={SUN_SVG} className="h-8 w-8 fill-current text-brand-800" />
          </button>
          <button
            className={cn({
              'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border': true,
            })}
          >
            <Icon icon={CHART_SVG} className="h-8 w-8 fill-current text-brand-800" />
          </button>
        </div>
        <HoverMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* <Menu /> */}
    </div>
  );
};

export default Sidebar;
