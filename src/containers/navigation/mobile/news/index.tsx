import BlogContent from 'containers/blog/content';

import { Dialog, DialogClose, DialogContent, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import NEWS_SVG from 'svgs/tools-bar/news.svg?sprite';

const MobileNews = () => (
  <>
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex w-12 cursor-pointer flex-col items-center space-y-1.5 pt-1.5">
          <Icon icon={NEWS_SVG} className="h-7 w-7 text-white" description="News" />
          <span className="text-xxs text-white">News</span>
        </div>
      </DialogTrigger>

      <DialogContent className="scroll-y top-0 h-screen w-full rounded-none px-0 py-0 font-sans">
        <BlogContent />
      </DialogContent>
    </Dialog>
  </>
);

export default MobileNews;
