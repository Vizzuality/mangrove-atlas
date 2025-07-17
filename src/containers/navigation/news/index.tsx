import { activeGuideAtom } from 'store/guide';

import { useRecoilValue } from 'recoil';

import { useBlogPosts } from 'hooks/blog';

import Helper from 'containers/help/helper';
import BlogContent from 'containers/news/content';

import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';
import Icon from 'components/ui/icon';

import NEWS_SVG from 'svgs/tools-bar/news.svg?sprite';
import { trackEvent } from 'lib/analytics/ga';

const News = () => {
  const guideIsActive = useRecoilValue(activeGuideAtom);
  const { data } = useBlogPosts({ wl_topic: [53] });

  const handleAnalytics = () => {
    // Google Analytics tracking
    trackEvent('News', {
      action: 'News',
      label: 'News - activated',
    });
  };

  return (
    <Dialog onOpenChange={handleAnalytics}>
      <DialogTrigger>
        <div data-testid="news-button" className="flex h-full cursor-pointer">
          <Helper
            className={{
              button: '-top-2.5 -right-4 z-20',
              tooltip: 'w-fit-content',
            }}
            tooltipPosition={{ top: -40, left: 0 }}
            message="Latest news from the Global Mangrove Alliance"
          >
            <div className="flex items-center space-x-2">
              <Icon icon={NEWS_SVG} className="h-6 w-6 text-white" description="New" />
              <span className="text-sm text-white">News</span>
            </div>
          </Helper>
        </div>
      </DialogTrigger>

      {!guideIsActive && data && (
        <DialogContent className="md:mb-20">
          <BlogContent />
        </DialogContent>
      )}
    </Dialog>
  );
};

export default News;
