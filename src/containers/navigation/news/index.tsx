'use client';

import { activeGuideAtom } from '@/store/guide';

import { useAtomValue } from 'jotai';

import { useClientLocalStorage } from 'hooks/use-client-local-storage';

import Helper from '@/containers/help/helper';
import NewsTooltipBody from '@/containers/navigation/news/news-tooltip-body';
import { useNews } from '@/containers/navigation/news/use-news';
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

const NewsButton = ({
  showIndicator,
  onClick,
}: {
  showIndicator: boolean;
  onClick: () => void;
}) => {
  const [hasSeenWelcome] = useClientLocalStorage<boolean>('welcomeIntroMessage', false);
  return (
    <button
      type="button"
      data-testid="news-button"
      aria-label="Open news and updates"
      onClick={onClick}
      className="relative flex h-full cursor-pointer items-center rounded px-2 transition outline-none"
    >
      <Helper
        className={{ button: '-top-2.5 -right-4 z-20', tooltip: 'w-fit-content' }}
        tooltipPosition={{ top: -40, left: 0 }}
        message="Latest news from the Global Mangrove Alliance"
      >
        <div className="flex flex-col items-center space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2">
          {hasSeenWelcome && (
            <span className="relative inline-block h-6 w-6">
              <NEWS_SVG className="h-6 w-6 fill-current text-white" role="img" title="News" />
              {showIndicator && (
                <span
                  aria-hidden
                  className="border-brand-800 absolute -top-[2.5px] -right-0.5 h-3.5 w-3.5 rounded-full border-[2.5px] bg-white"
                />
              )}
            </span>
          )}
          <span className="text-xxs leading-none text-white lg:text-sm lg:leading-normal">
            News<span className="hidden lg:inline"> & Updates</span>
          </span>
        </div>
      </Helper>
    </button>
  );
};

const News = () => {
  const {
    data,
    open,
    setOpen,
    showIndicator,
    shouldShowUpdateTooltip,
    markAsSeen,
    handleOpenDialog,
  } = useNews();

  const guideIsActive = useAtomValue(activeGuideAtom);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {shouldShowUpdateTooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <NewsButton showIndicator={showIndicator} onClick={handleOpenDialog} />
            </TooltipTrigger>

            <TooltipContent
              className="min-h-content relative flex h-full max-h-none rounded-xl p-4"
              side="bottom"
            >
              <TooltipArrow className="fill-white" />
              <NewsTooltipBody
                unseenPosts={data?.unseenPosts ?? []}
                onDismissTooltip={markAsSeen}
              />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
