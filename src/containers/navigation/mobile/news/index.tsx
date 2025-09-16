import BlogContent from 'containers/news/content';

import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';
import Icon from 'components/ui/icon';

import NEWS_SVG from 'svgs/tools-bar/news.svg?sprite';
import { DialogTitle } from '@radix-ui/react-dialog';

const MobileNews = () => (
  <>
    <Dialog>
      <DialogTrigger className="h-full">
        <div className="flex h-full w-12 cursor-pointer flex-col items-center space-y-1.5 pt-1.5">
          <Icon icon={NEWS_SVG} className="h-7 w-7 text-white" description="News" />
          <span className="text-xxs text-white">News</span>
        </div>
      </DialogTrigger>

      <DialogContent className="scroll-y md:auto top-0 h-screen w-screen font-sans">
        <DialogTitle className="sr-only">News</DialogTitle>
        <BlogContent />
      </DialogContent>
    </Dialog>
  </>
);

export default MobileNews;
