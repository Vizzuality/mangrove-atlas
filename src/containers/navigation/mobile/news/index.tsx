import { DialogTitle } from '@radix-ui/react-dialog';

import BlogContent from '@/containers/news/content';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import NEWS_SVG from '@/svgs/tools-bar/news';

const MobileNews = () => (
  <>
    <Dialog>
      <DialogTrigger className="h-full">
        <div className="flex h-full w-12 cursor-pointer flex-col items-center space-y-1.5 pt-1.5">
          <NEWS_SVG className="h-7 w-7 fill-current text-white" role="img" title="News" />
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
