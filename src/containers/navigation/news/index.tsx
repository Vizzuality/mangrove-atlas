import BlogContent from 'containers/blog/content';

import { Dialog, DialogContent, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import NEWS_SVG from 'svgs/tools-bar/news.svg?sprite';

const News = () => (
  <Dialog>
    <DialogTrigger asChild>
      <div data-testid="menu-button" className="flex cursor-pointer items-center space-x-2">
        <Icon icon={NEWS_SVG} className="h-6 w-6 text-white" description="New" />
        <span className="text-sm text-white">News</span>
      </div>
    </DialogTrigger>

    <DialogContent className="scroll-y top-[5%] h-[96%] w-11/12 rounded-3xl px-0 pt-10 pb-0 font-sans md:top-auto md:h-[90vh] md:max-w-xl md:py-0">
      <BlogContent />
    </DialogContent>
  </Dialog>
);

export default News;