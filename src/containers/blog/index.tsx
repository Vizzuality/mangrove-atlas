import cn from 'classnames';

import { Dialog, DialogContent, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite';
import NEWS_SVG from 'svgs/ui/news.svg?sprite';

import BlogContent from './content';

export const Blog = ({ closeBlogBanner }: { closeBlogBanner: (e) => void }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative my-2 ml-[3%] flex h-12 w-[94%] items-center justify-between rounded-2xl bg-brand-800 px-4 md:ml-0 lg:w-[540px] print:hidden">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Icon
              icon={NEWS_SVG}
              className={cn({
                'h-7 w-7 fill-white': true,
              })}
              description="News"
            />
            <p className="font-sans text-xxs text-white sm:text-xs lg:text-sm">
              Stay updated with the latest mangrove news!
            </p>
          </div>
          <button
            aria-label="Explore blog"
            className="flex items-center rounded-2xl bg-white py-1 px-2 font-sans text-xxs text-brand-800 transition duration-300 delay-150 ease-in-out hover:bg-transparent hover:text-white sm:px-3 sm:text-xs md:px-6 lg:text-sm"
          >
            Explore Now
          </button>
          <button onClick={(e) => closeBlogBanner(e)} aria-label="close blog">
            <Icon icon={CLOSE_SVG} className="h-4 w-4 fill-white" description="Close" />
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="scroll-y top-[5%] h-[96%] w-11/12 rounded-3xl px-0 pt-10 pb-0 font-sans md:top-auto md:h-[90vh] md:max-w-xl md:py-0">
        <BlogContent />
      </DialogContent>
    </Dialog>
  );
};

export default Blog;
