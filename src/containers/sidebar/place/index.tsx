/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import cn from 'lib/classnames';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import LocationsList from 'containers/locations-list';

import { Dialog, DialogContent, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import AREA_SVG from 'svgs/sidebar/area.svg?sprite';
import GLASS_SVG from 'svgs/sidebar/glass.svg?sprite';
import GLOBE_SVG from 'svgs/sidebar/globe.svg?sprite';
import CLOSE_SVG from 'svgs/ui/close.svg?sprite';

const Place = () => {
  return (
    <>
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
          <Dialog>
            <DialogTrigger>
              <div
                className={cn({
                  'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full': true,
                })}
              >
                <Icon icon={GLASS_SVG} className="h-8 w-8 fill-current text-brand-800" />
              </div>
            </DialogTrigger>
            <DialogContent className="h-[90vh] w-[540px] rounded-[20px]">
              <LocationsList />
              <DialogPrimitive.Close className="absolute top-7 -right-10 z-50 flex h-11 w-10 cursor-pointer items-center justify-end rounded-r-[10px] border bg-white hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                <Icon icon={CLOSE_SVG} className="mr-2.5 h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </DialogContent>
          </Dialog>
          <button
            className={cn({
              'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full': true,
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
