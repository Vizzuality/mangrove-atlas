'use client';

import { activeGuideAtom } from '@/store/guide';
import { useLocalStorage } from 'usehooks-ts';
import { useRecoilValue } from 'recoil';
import { useBlogPosts } from 'hooks/blog';
import Helper from '@/containers/help/helper';
import BlogContent from '@/containers/news/content';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import Icon from '@/components/ui/icon';
import NEWS_SVG from '@/svgs/tools-bar/news.svg?sprite';
import { trackEvent } from '@/lib/analytics/ga';

import { HiX } from 'react-icons/hi';
import { FaExclamation } from 'react-icons/fa';
import { useEffect, useMemo, useState, useCallback } from 'react';

const HiXIcon = HiX as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;
const FaExclamationIcon = FaExclamation as unknown as (
  p: React.SVGProps<SVGSVGElement>
) => JSX.Element;

type PlatformUpdatesLastSeen = {
  seenLastPostDate?: string;
};

const UPDATE_WINDOW_DAYS = 4 * 12;

const NewsButton = ({
  showIndicator,
  onClick,
}: {
  showIndicator: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    data-testid="news-button"
    aria-label="Open news and updates"
    onClick={onClick}
    className="relative flex h-full items-center rounded px-2 transition outline-none"
  >
    <Helper
      className={{ button: '-top-2.5 -right-4 z-20', tooltip: 'w-fit-content' }}
      tooltipPosition={{ top: -40, left: 0 }}
      message="Latest news from the Global Mangrove Alliance"
    >
      <div className="flex items-center space-x-2">
        <span className="relative">
          <Icon icon={NEWS_SVG} className="h-6 w-6 text-white" description="News" />
          {showIndicator && (
            <FaExclamationIcon className="absolute -top-1 -left-1 h-3 w-3 rounded-full border border-white bg-[#EE4D5A] fill-current p-0.5 text-white" />
          )}
        </span>
        <span className="text-sm text-white">News & Updates</span>
      </div>
    </Helper>
  </button>
);

const NewsTooltip = ({
  showIndicator,
  onOpenDialog,
  onDismissTooltip,
}: {
  showIndicator: boolean;
  onOpenDialog: () => void;
  onDismissTooltip: () => void;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <NewsButton showIndicator={showIndicator} onClick={onOpenDialog} />
        </TooltipTrigger>

        <TooltipContent className="relative rounded-xl p-4">
          <TooltipArrow className="fill-white" />
          <div className="max-w-xs space-y-1 sm:max-w-[280px]">
            <div className="flex items-center justify-between space-x-2 font-bold">
              <span className="text-xs uppercase">Tool updated!</span>
              <HiXIcon
                className="absolute top-2 right-2 h-4 w-4 cursor-pointer font-extrabold"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); // important: don’t open dialog when clicking X
                  onDismissTooltip();
                }}
              />
            </div>
            <p className="text-sm">
              A new version is live. See what’s been improved and discover the new features added to
              the tool.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const News = () => {
  const [open, setOpen] = useState(false);

  const [platformUpdates, setPlatformUpdates] = useLocalStorage<PlatformUpdatesLastSeen>(
    'platformUpdates',
    { seenLastPostDate: undefined }
  );

  const guideIsActive = useRecoilValue(activeGuideAtom);
  const DEBUG_FAKE_LAST_POST_DATE = process.env.NEXT_PUBLIC_FAKE_NEWS_DATE || undefined;

  const { data } = useBlogPosts(
    { wl_topic: [53] },
    {
      select: (posts) => {
        if (!posts?.length) return null;
        const sorted = posts.slice().sort((a, b) => +new Date(b.date) - +new Date(a.date));
        const top = sorted[0];
        const lastPostDate = DEBUG_FAKE_LAST_POST_DATE ?? top.date;

        return {
          posts,
          lastPostDate,
          daysAgo: Math.floor((Date.now() - +new Date(lastPostDate)) / 86_400_000),
        };
      },
    }
  );

  const hasRecentUpdate = useMemo(
    () => !!data?.lastPostDate && (data.daysAgo ?? Infinity) <= UPDATE_WINDOW_DAYS,
    [data?.lastPostDate, data?.daysAgo]
  );

  const shouldShowUpdateTooltip =
    hasRecentUpdate && platformUpdates.seenLastPostDate !== data?.lastPostDate;

  const showIndicator = shouldShowUpdateTooltip;

  const markAsSeen = useCallback(() => {
    if (!data?.lastPostDate) return;
    setPlatformUpdates({ seenLastPostDate: data.lastPostDate });
  }, [data?.lastPostDate, setPlatformUpdates]);

  const handleOpenDialog = useCallback(() => {
    setOpen(true);
    if (data?.lastPostDate) {
      setPlatformUpdates({ seenLastPostDate: data.lastPostDate });
    }

    // analytics
    trackEvent('News', {
      category: 'Menu - News',
      action: 'click',
      label: 'News - activated',
    });
  }, [data?.lastPostDate, setPlatformUpdates]);

  useEffect(() => {
    if (!data?.lastPostDate) return;
    if (!hasRecentUpdate && platformUpdates.seenLastPostDate !== data.lastPostDate) {
      setPlatformUpdates({ seenLastPostDate: data.lastPostDate });
    }
  }, [data?.lastPostDate, hasRecentUpdate, platformUpdates.seenLastPostDate, setPlatformUpdates]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {shouldShowUpdateTooltip ? (
        <NewsTooltip
          showIndicator={showIndicator}
          onOpenDialog={handleOpenDialog}
          onDismissTooltip={markAsSeen}
        />
      ) : (
        <NewsButton showIndicator={showIndicator} onClick={handleOpenDialog} />
      )}

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
