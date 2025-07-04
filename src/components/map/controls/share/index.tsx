import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { Dialog, DialogClose, DialogContent, DialogTrigger } from 'components/ui/dialog';
import Icon from 'components/ui/icon';
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from 'components/ui/tooltip';

import SHARE_SVG from 'svgs/map/share.svg?sprite';
import Helper from 'containers/help/helper';

export const Share = ({
  className,
  disabled = false,
}: {
  className?: string;
  disabled: boolean;
}) => {
  const { asPath } = useRouter();

  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [embeddedLink, setEmbeddedLink] = useState<string | null>(null);

  const [shareLinkBtnText, setShareLinkBtnText] = useState('Copy link');
  const [shareEmbedCodeBtnText, setShareEmbedCodeBtnText] = useState('Copy code');

  useEffect(() => {
    setCurrentUrl(window.location.href);
    setEmbeddedLink(
      `<iframe src="${window.location.origin}/embedded${asPath.slice(
        1,
        asPath.length
      )}" title="Global Mangrove Watch"></iframe>`
    );
  }, [asPath]);

  const copyShareLink = useCallback(() => {
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setShareLinkBtnText('Copied');
        setTimeout(function () {
          setShareLinkBtnText('Copy link');
        }, 5000);
      })
      .catch((err: ErrorEvent) => {
        console.info(err.message);
      });
  }, [currentUrl]);

  const copyEmbeddedCode = useCallback(
    () =>
      navigator.clipboard
        .writeText(embeddedLink)
        .then(() => {
          setShareEmbedCodeBtnText('Copied');
          setTimeout(function () {
            setShareEmbedCodeBtnText('Copy code');
          }, 5000);
        })
        .catch((err: ErrorEvent) => {
          console.info(err.message);
        }),
    [embeddedLink]
  );

  return (
    <>
      {!disabled && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Dialog>
              <DialogTrigger>
                <div
                  className={cn({
                    'group inline-flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-full bg-white shadow-control hover:bg-gray-100 disabled:cursor-default disabled:bg-gray-50 disabled:outline-none':
                      true,
                    [className]: !!className,
                  })}
                >
                  <Icon
                    icon={SHARE_SVG}
                    className="h-4 w-4 bg-white group-hover:bg-gray-100"
                    description="Share"
                  />
                </div>
              </DialogTrigger>

              <DialogContent className="top-[30%] text-black/85">
                <h3 className="mb-2 text-3xl font-light">Share</h3>
                <div className="flex w-[480px] flex-col space-y-5">
                  <div className="flex flex-col space-y-1">
                    <h4 className="ml-4 text-[13px] font-semibold">Public url to share</h4>
                    <div className="flex h-12 items-center justify-between space-x-4 rounded-3xl bg-brand-600/10 p-4 text-sm">
                      <p className="truncate">{currentUrl}</p>
                      <button
                        onClick={copyShareLink}
                        className="whitespace-nowrap rounded-3xl border border-brand-800/20 py-1 px-5 font-semibold text-brand-800 hover:bg-brand-800/20"
                      >
                        {shareLinkBtnText}
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="ml-4 text-[13px] font-semibold">Code to embed map</h4>
                    <div className="flex h-12 items-center space-x-4 rounded-3xl bg-brand-600/10 p-4 text-sm">
                      <p className="truncate">{embeddedLink}</p>
                      <button
                        onClick={copyEmbeddedCode}
                        className="whitespace-nowrap rounded-3xl border border-brand-800/20 py-1 px-5 font-semibold text-brand-800 hover:bg-brand-800/20"
                      >
                        {shareEmbedCodeBtnText}
                      </button>
                    </div>
                  </div>
                </div>
                <DialogClose />
              </DialogContent>
            </Dialog>
          </TooltipTrigger>
          <TooltipContent side="left" align="start" className="bg-gray-600 px-2 text-white">
            Share
          </TooltipContent>
        </Tooltip>
      )}
      {disabled && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn({
                'group inline-flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-full bg-white shadow-control hover:bg-gray-100 disabled:cursor-default disabled:bg-gray-50 disabled:outline-none':
                  true,
                [className]: !!className,
              })}
            >
              <Icon
                icon={SHARE_SVG}
                className="h-4 w-4 bg-white opacity-40 group-hover:bg-gray-100"
                description="Share"
              />
            </div>
          </TooltipTrigger>

          <TooltipPortal>
            <TooltipContent side="left" align="center" className="bg-gray-600 px-2 text-white">
              It is not possible to share a custom area
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      )}
    </>
  );
};

export default Share;
