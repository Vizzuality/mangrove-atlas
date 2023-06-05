import cn from 'classnames';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import NEWS_SVG from 'svgs/ui/news.svg?sprite';

export const ExploreBanner = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="absolute top-72 left-20 z-20 h-12 w-[540px] rounded-2xl bg-brand-800">
          <div className="flex h-full items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              <Icon
                icon={NEWS_SVG}
                className={cn({
                  'h-7 w-7 fill-white': true,
                })}
              />
              <p className="font-sans text-sm text-white">
                Stay updated with the latest mangrove news!
              </p>
            </div>
            <button className="flex items-center rounded-2xl bg-white px-6 py-1 font-sans text-sm text-brand-800 transition duration-300 delay-150 ease-in-out hover:bg-transparent hover:text-white">
              Explore Now
            </button>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="scroll-y top-24 h-[555px] rounded-[20px] px-10 py-0">
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default ExploreBanner;
