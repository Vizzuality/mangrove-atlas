/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import cn from 'lib/classnames';

import LocationsList from 'containers/locations-list';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import AREA_SVG from 'svgs/sidebar/area.svg?sprite';
import GLASS_SVG from 'svgs/sidebar/glass.svg?sprite';
import GLOBE_SVG from 'svgs/sidebar/globe.svg?sprite';

import { STYLES } from '../constants';

const Place = () => {
  return (
    <>
      <div className="flex flex-col text-center">
        <div className="w-10.5 py-2 font-sans text-xxs leading-[10px] text-white">Place</div>
        <div className={`${STYLES['icon-wrapper']} space-y-4 rounded-full bg-white py-1`}>
          <button className="h-10.5 flex w-10.5 cursor-pointer items-center justify-center rounded-full">
            <Icon icon={GLOBE_SVG} className="h-8 w-8 fill-current text-brand-800" />
          </button>
          <Dialog>
            <DialogTrigger>
              <div className="h-10.5 flex w-10.5 cursor-pointer items-center justify-center rounded-full">
                <Icon icon={GLASS_SVG} className="h-8 w-8 fill-current text-brand-800" />
              </div>
            </DialogTrigger>
            <DialogContent className="h-[90vh] w-[540px] rounded-[20px] px-10 pt-10 pb-0">
              <LocationsList />
              <DialogClose />
            </DialogContent>
          </Dialog>
          <button
            className={cn({
              'h-10.5 flex w-10.5 cursor-pointer items-center justify-center rounded-full': true,
            })}
          >
            <Icon icon={AREA_SVG} className="h-8 w-8 fill-current text-brand-800" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Place;
