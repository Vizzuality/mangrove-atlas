import { useCallback, useState } from 'react';

import cn from '@/lib/classnames';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from '@/components/ui/tooltip';

import SHARE_SVG from '@/svgs/map/share';

type ShareTargets = {
  url: string;
  embedCode: string;
};

/**
 * Built from `window.location` rather than from `usePathname` / `useSearchParams`: what gets
 * copied has to be exactly the view the user is looking at, and `window.location` is the one
 * source that is always current, whatever a router hook last re-rendered with.
 */
function readShareTargets(): ShareTargets {
  const { origin, pathname, search, href } = window.location;

  // `/` would otherwise produce `/embedded/`, and every other path needs its leading slash kept —
  // dropping it built `/embeddedcountry/IDN` instead of `/embedded/country/IDN`.
  const path = pathname === '/' ? '' : pathname;

  return {
    url: href,
    embedCode: `<iframe src="${origin}/embedded${path}${search}" title="Global Mangrove Watch"></iframe>`,
  };
}

const Share = ({ className, disabled = false }: { className?: string; disabled: boolean }) => {
  const [shareTargets, setShareTargets] = useState<ShareTargets | null>(null);

  // Snapshot as the dialog opens. It's modal, so the view can't change while it's up — one read
  // guarantees the displayed URL and the copied one are the same thing.
  const handleOpenChange = useCallback((open: boolean) => {
    setShareTargets(open ? readShareTargets() : null);
  }, []);

  const [shareLinkBtnText, setShareLinkBtnText] = useState('Copy link');
  const [shareEmbedCodeBtnText, setShareEmbedCodeBtnText] = useState('Copy code');

  const copyShareLink = useCallback(() => {
    navigator.clipboard
      .writeText(shareTargets?.url || '')
      .then(() => {
        setShareLinkBtnText('Copied');
        setTimeout(function () {
          setShareLinkBtnText('Copy link');
        }, 5000);
      })
      .catch((err: ErrorEvent) => {
        console.info(err.message);
      });
  }, [shareTargets]);

  const copyEmbeddedCode = useCallback(
    () =>
      navigator.clipboard
        .writeText(shareTargets?.embedCode || '')
        .then(() => {
          setShareEmbedCodeBtnText('Copied');
          setTimeout(function () {
            setShareEmbedCodeBtnText('Copy code');
          }, 5000);
        })
        .catch((err: ErrorEvent) => {
          console.info(err.message);
        }),
    [shareTargets]
  );

  return (
    <>
      {!disabled && (
        <Dialog onOpenChange={handleOpenChange}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label="Share"
                  className={cn({
                    'group shadow-control focus-visible:shadow-control-focus inline-flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white text-black hover:bg-gray-100 disabled:cursor-default disabled:bg-gray-50 disabled:outline-none': true,
                  })}
                >
                  <SHARE_SVG className="h-4 w-4 group-hover:bg-gray-100" aria-hidden="true" />
                </button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-600 px-2 text-white">Share</TooltipContent>
          </Tooltip>

          <DialogContent className="top-[30%] text-black/85">
            <DialogTitle className="mb-2 text-3xl font-light">Share</DialogTitle>
            <div className="flex w-[480px] flex-col space-y-5">
              <div className="flex flex-col space-y-1">
                <h4 className="ml-4 text-[13px] font-semibold">Public url to share</h4>
                <div className="bg-brand-600/10 flex h-12 items-center justify-between space-x-4 rounded-3xl p-4 text-sm">
                  <p className="truncate">{shareTargets?.url}</p>
                  <button
                    onClick={copyShareLink}
                    className="border-brand-800/20 text-brand-800 hover:bg-brand-800/20 rounded-3xl border px-5 py-1 font-semibold whitespace-nowrap"
                  >
                    {shareLinkBtnText}
                  </button>
                </div>
              </div>
              <div>
                <h4 className="ml-4 text-[13px] font-semibold">Code to embed map</h4>
                <div className="bg-brand-600/10 flex h-12 items-center space-x-4 rounded-3xl p-4 text-sm">
                  <p className="truncate">{shareTargets?.embedCode}</p>
                  <button
                    onClick={copyEmbeddedCode}
                    className="border-brand-800/20 text-brand-800 hover:bg-brand-800/20 rounded-3xl border px-5 py-1 font-semibold whitespace-nowrap"
                  >
                    {shareEmbedCodeBtnText}
                  </button>
                </div>
              </div>
            </div>
            <DialogClose />
          </DialogContent>
        </Dialog>
      )}
      {disabled && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              disabled
              aria-label="Share (unavailable for custom areas)"
              className={cn(className, {
                'group shadow-control focus-visible:shadow-control-focus inline-flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white hover:bg-gray-100 disabled:cursor-default disabled:bg-gray-50 disabled:outline-none': true,
              })}
            >
              <SHARE_SVG
                className="h-4 w-4 bg-white fill-current opacity-40 group-hover:bg-gray-100"
                aria-hidden="true"
              />
            </button>
          </TooltipTrigger>

          <TooltipPortal>
            <TooltipContent className="bg-gray-600 px-2 text-white">
              It is not possible to share a custom area
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      )}
    </>
  );
};

export default Share;
