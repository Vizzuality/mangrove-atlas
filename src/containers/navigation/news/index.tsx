'use client';

import { useMemo, useState, useCallback } from 'react';

import Image from 'next/image';

import { trackEvent } from '@/lib/analytics/ga';

import { activeGuideAtom } from '@/store/guide';

import { useAtomValue } from 'jotai';
import { HiX } from 'react-icons/hi';
import { useLocalStorage } from 'usehooks-ts';

import { useBlogPosts } from 'hooks/blog';
import type { PostProps } from 'hooks/blog/types';

import LayoutMdx from '@/layouts/mdx';

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

import NEWS_SVG from '@/svgs/tools-bar/news';

const HiXIcon = HiX as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;

type PlatformUpdatesLastSeen = {
  seenLastPostDate?: string;
};

const UPDATE_WINDOW_DAYS = 4 * 12;

const TooltipItem = ({ post }: { post: PostProps }) => (
  <li className="flex cursor-pointer items-start space-x-2 rounded-sm p-2 transition hover:bg-gray-100">
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm">
      <Image
        src={post.yoast_head_json.og_image[0].url}
        alt={post.title.rendered}
        fill
        className="object-cover"
      />
    </div>

    <div className="flex min-w-0 flex-1 flex-col">
      <span className="bg-brand-800 text-xxs w-fit rounded-sm px-2 font-bold text-white uppercase">
        update
      </span>

      <LayoutMdx className="text-xs leading-4 font-light">{post.title.rendered}</LayoutMdx>
    </div>
  </li>
);

const NewsButton = ({
  showIndicator,
  onClick,
}: {
  showIndicator: boolean;
  onClick: () => void;
}) => {
  const [hasSeenWelcome] = useLocalStorage<boolean>('welcomeIntroMessage', false);
  return (
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
          {hasSeenWelcome && (
            <span className="relative">
              <NEWS_SVG className="h-6 w-6 fill-current text-white" role="img" title="News" />
              {showIndicator && (
                <span className="border-brand-800 absolute -top-[2.5px] -right-0.5 h-3.5 w-3.5 rounded-full border-[2.5px] bg-white fill-current p-0.5 text-white" />
              )}
            </span>
          )}
          <span className="text-sm text-white">News & Updates</span>
        </div>
      </Helper>
    </button>
  );
};

const NewsTooltip = ({
  showIndicator,
  onOpenDialog,
  onDismissTooltip,
  unseenPosts,
}: {
  showIndicator: boolean;
  onOpenDialog: () => void;
  onDismissTooltip: () => void;
  unseenPosts: PostProps[];
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <NewsButton showIndicator={showIndicator} onClick={onOpenDialog} />
        </TooltipTrigger>

        <TooltipContent
          className="min-h-content relative flex h-full max-h-none rounded-xl p-4"
          side="bottom"
        >
          <TooltipArrow className="fill-white" />
          <>
            {!unseenPosts?.length && (
              <div className="max-w-xs space-y-1 sm:max-w-70">
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
                  A new version is live. See what’s been improved and discover the new features
                  added to the tool.
                </p>
              </div>
            )}

            <ul className="max-w-2xs space-y-2">
              {unseenPosts?.map((post) => <TooltipItem key={post.id} post={post} />)}
              <HiXIcon
                className="absolute top-2 right-2 h-4 w-4 cursor-pointer font-extrabold"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); // important: don’t open dialog when clicking X
                  onDismissTooltip();
                }}
              />
            </ul>
          </>
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

  const guideIsActive = useAtomValue(activeGuideAtom);
  const DEBUG_FAKE_LAST_POST_DATE = process.env.NEXT_PUBLIC_FAKE_NEWS_DATE || undefined;
  const seenLastPostDate = DEBUG_FAKE_LAST_POST_DATE ?? platformUpdates.seenLastPostDate;

  type NewsData = {
    posts: PostProps[];
    latestPost: PostProps;
    latestPostDate: string;
    seenLastPostDate: string | undefined;
    unseenPosts: PostProps[];
    daysAgo: number;
  } | null;

  const { data } = useBlogPosts<NewsData>(
    { wl_topic: [53] },
    {
      select: (posts) => {
        if (!posts?.length) return null;

        const sorted = posts.slice().sort((a, b) => +new Date(b.date) - +new Date(a.date));
        const latestPost = sorted[0];
        const latestPostDate = latestPost.date;

        const unseenPosts = seenLastPostDate
          ? sorted.filter((post) => +new Date(post.date) > +new Date(seenLastPostDate))
          : sorted;

        return {
          posts: sorted,
          latestPost,
          latestPostDate,
          seenLastPostDate,
          unseenPosts,
          daysAgo: Math.floor((Date.now() - +new Date(latestPostDate)) / 86_400_000),
        };
      },
    }
  );

  const hasRecentUpdate = useMemo(
    () => !!data?.latestPostDate && (data.daysAgo ?? Infinity) <= UPDATE_WINDOW_DAYS,
    [data?.latestPostDate, data?.daysAgo]
  );

  const shouldShowUpdateTooltip =
    (hasRecentUpdate && platformUpdates.seenLastPostDate !== data?.latestPostDate) ||
    !platformUpdates.seenLastPostDate;

  const showIndicator = shouldShowUpdateTooltip;

  const markAsSeen = useCallback(() => {
    if (!data?.latestPostDate) return;
    setPlatformUpdates({ seenLastPostDate: data.latestPostDate });
  }, [data, setPlatformUpdates]);

  const handleOpenDialog = useCallback(() => {
    setOpen(true);
    if (data?.latestPostDate) {
      setPlatformUpdates({ seenLastPostDate: data.latestPostDate });
    }

    // analytics
    trackEvent('News', {
      category: 'Menu - News',
      action: 'click',
      label: 'News - activated',
    });
  }, [data, setPlatformUpdates]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {shouldShowUpdateTooltip ? (
        <NewsTooltip
          showIndicator={showIndicator}
          onOpenDialog={handleOpenDialog}
          onDismissTooltip={markAsSeen}
          unseenPosts={data?.unseenPosts ?? []}
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
