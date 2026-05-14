import { useCallback, useMemo, useState } from 'react';

import { trackEvent } from '@/lib/analytics/ga';

import { useLocalStorage } from 'usehooks-ts';

import { useBlogPosts } from 'hooks/blog';
import type { PostProps } from 'hooks/blog/types';

const UPDATE_WINDOW_DAYS = 4 * 12;

type PlatformUpdatesLastSeen = {
  seenLastPostDate?: string;
};

export type NewsData = {
  posts: PostProps[];
  latestPost: PostProps;
  latestPostDate: string;
  seenLastPostDate: string | undefined;
  unseenPosts: PostProps[];
  daysAgo: number;
} | null;

export function useNews() {
  const [open, setOpen] = useState(false);

  const [platformUpdates, setPlatformUpdates] = useLocalStorage<PlatformUpdatesLastSeen>(
    'platformUpdates',
    { seenLastPostDate: undefined }
  );

  const DEBUG_FAKE_LAST_POST_DATE = process.env.NEXT_PUBLIC_FAKE_NEWS_DATE || undefined;
  const seenLastPostDate = DEBUG_FAKE_LAST_POST_DATE ?? platformUpdates.seenLastPostDate;

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

    trackEvent('News', {
      category: 'Menu - News',
      action: 'click',
      label: 'News - activated',
    });
  }, [data, setPlatformUpdates]);

  return {
    data,
    open,
    setOpen,
    showIndicator,
    shouldShowUpdateTooltip,
    markAsSeen,
    handleOpenDialog,
  };
}
