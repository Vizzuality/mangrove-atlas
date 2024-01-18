import { activeGuideAtom } from 'store/guide';

import { useRecoilValue } from 'recoil';

import Helper from 'containers/guide/helper';
import BlogContent from 'containers/news/content';

import { Dialog, DialogContent, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import NEWS_SVG from 'svgs/tools-bar/news.svg?sprite';

const News = () => {
  const guideIsActive = useRecoilValue(activeGuideAtom);

  return (
    <Dialog>
      <DialogTrigger>
        <div data-testid="menu-button" className="flex cursor-pointer">
          <Helper
            className={{
              button: '-top-2.5 -right-4 z-20',
              tooltip: 'w-fit-content',
            }}
            theme="dark"
            tooltipPosition={{ top: -40, left: 0 }}
            message="news"
          >
            <div className="flex items-center space-x-2">
              <Icon icon={NEWS_SVG} className="h-6 w-6 text-white" description="New" />
              <span className="text-sm text-white">News</span>
            </div>
          </Helper>
        </div>
      </DialogTrigger>

      {!guideIsActive && (
        <DialogContent>
          <BlogContent />
        </DialogContent>
      )}
    </Dialog>
  );
};

export default News;
