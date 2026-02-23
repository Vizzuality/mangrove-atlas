import { activeGuideAtom } from '@/store/guide';

import { useLocalStorage } from 'usehooks-ts';

import { useRecoilValue } from 'recoil';

import { useBlogPosts } from 'hooks/blog';

import Helper from '@/containers/help/helper';
import BlogContent from '@/containers/news/content';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import Icon from '@/components/ui/icon';

import NEWS_SVG from '@/svgs/tools-bar/news.svg?sprite';
import { trackEvent } from '@/lib/analytics/ga';
import { HiX } from 'react-icons/hi';
import { useEffect } from 'react';

const HiXIcon = HiX as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;

type PlatformUpdatesLastSeen = {
  seenLastPostDate?: string;
};

const UPDATE_WINDOW_DAYS = 4 * 12;

const NewsTooltip = ({ handleClose }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <DialogTrigger asChild>
          <button
            type="button"
            data-testid="news-button"
            aria-label="Open news and updates"
            className="flex h-full items-center rounded px-2 transition outline-none"
          >
            <Helper
              className={{ button: '-top-2.5 -right-4 z-20', tooltip: 'w-fit-content' }}
              tooltipPosition={{ top: -40, left: 0 }}
              message="Latest news from the Global Mangrove Alliance"
            >
              <div className="flex items-center space-x-2">
                <Icon icon={NEWS_SVG} className="h-6 w-6 text-white" description="News" />
                <span className="text-sm text-white">News & Updates</span>
              </div>
            </Helper>
          </button>
        </DialogTrigger>
      </TooltipTrigger>

      <TooltipContent className="relative rounded-xl p-4">
        <TooltipArrow className="fill-white" />
        <div className="max-w-xs space-y-1 sm:max-w-[280px]">
          <div className="flex items-center justify-between space-x-2 font-bold">
            <span className="text-xs uppercase">Tool updated!</span>
            <HiXIcon
              className="absolute top-2 right-2 h-4 w-4 font-extrabold"
              onClick={handleClose}
            />
          </div>
          <p className="text-sm">
            A new version is live. See what’s been improved and discover the new features added to
            the tool.
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

const DialogNewsTrigger = (
  <DialogTrigger asChild>
    <button
      type="button"
      data-testid="news-button"
      aria-label="Open news and updates"
      className="flex h-full items-center rounded px-2 transition outline-none"
    >
      <Helper
        className={{ button: '-top-2.5 -right-4 z-20', tooltip: 'w-fit-content' }}
        tooltipPosition={{ top: -40, left: 0 }}
        message="Latest news from the Global Mangrove Alliance"
      >
        <div className="flex items-center space-x-2">
          <Icon icon={NEWS_SVG} className="h-6 w-6 text-white" description="News" />
          <span className="text-sm text-white">News & Updates</span>
        </div>
      </Helper>
    </button>
  </DialogTrigger>
);

const News = () => {
  const [platformUpdates, setPlatformUpdates] = useLocalStorage<PlatformUpdatesLastSeen>(
    'platformUpdates',
    { seenLastPostDate: undefined }
  );
  const guideIsActive = useRecoilValue(activeGuideAtom);

  const { data } = useBlogPosts(
    { wl_topic: [53] },
    {
      select: (posts) => {
        if (!posts?.length) return null;
        const sorted = posts.slice().sort((a, b) => +new Date(b.date) - +new Date(a.date));
        const top = sorted[0];
        return {
          posts,
          lastPostDate: top.date,
          daysAgo: Math.floor((Date.now() - +new Date(top.date)) / 86_400_000),
        };
      },
    }
  );

  const hasRecentUpdate = !!data?.lastPostDate && (data.daysAgo ?? Infinity) <= UPDATE_WINDOW_DAYS;

  const shouldShowUpdateTooltip =
    hasRecentUpdate && platformUpdates.seenLastPostDate !== data!.lastPostDate;

  const handleAnalytics = () => {
    // Google Analytics tracking
    trackEvent('News', {
      category: 'Menu - News',
      action: 'click',
      label: 'News - activated',
    });
  };

  const handleClose = () => {
    if (!data?.lastPostDate) return;
    setPlatformUpdates({ seenLastPostDate: data.lastPostDate });
  };

  useEffect(() => {
    if (!data?.lastPostDate) return;
    if (!hasRecentUpdate && platformUpdates.seenLastPostDate !== data.lastPostDate) {
      setPlatformUpdates({ seenLastPostDate: data.lastPostDate });
    }
  }, [data?.lastPostDate, hasRecentUpdate, platformUpdates.seenLastPostDate, setPlatformUpdates]);

  return (
    <Dialog onOpenChange={handleAnalytics}>
      {shouldShowUpdateTooltip ? <NewsTooltip handleClose={handleClose} /> : DialogNewsTrigger}
      {!guideIsActive && data && (
        <DialogContent className="md:mb-20">
          <DialogTitle className="sr-only">News &amp; updates</DialogTitle>
          <BlogContent />
        </DialogContent>
      )}
    </Dialog>
  );
};

export default News;
