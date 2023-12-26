import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { Dialog, DialogContent, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import SHARE_SVG from 'svgs/map/share.svg?sprite';

export const Share = ({ className }: { className?: string }) => {
  const { asPath } = useRouter();
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [, setBttnText] = useState('COPY CODE');
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [asPath]);

  const copyCode = () => {
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setBttnText('COPIED');
        setTimeout(function () {
          setBttnText('COPY CODE');
        }, 3000);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn({
            'inline-flex flex-col rounded-full shadow-md shadow-black/10': true,
            [className]: !!className,
          })}
        >
          <button
            className={cn({
              'group flex h-11 w-11 items-center justify-center rounded-full bg-white hover:bg-gray-100 disabled:cursor-default disabled:bg-gray-50 disabled:outline-none':
                true,
            })}
            aria-label="Toggle share"
            type="button"
            onClick={() => console.log('share link')}
          >
            <Icon
              icon={SHARE_SVG}
              className="h-5 w-5 bg-white group-hover:bg-gray-100 group-disabled:fill-grey-75"
              description="Share"
            />
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="scroll-y top-[5%] h-[40%] rounded-3xl p-10">
        SHARE Public url to share
        <p>{currentUrl}</p>
        <button
          onClick={copyCode}
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        >
          Copy link
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default Share;
