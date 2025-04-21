import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';
import Icon from 'components/ui/icon';
import BlogContent from 'containers/news/content';
import NEWS_SVG from 'svgs/tools-bar/news.svg?sprite';

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
        <BlogContent />
      </DialogContent>
    </Dialog>
  </>
);

export default MobileNews;
