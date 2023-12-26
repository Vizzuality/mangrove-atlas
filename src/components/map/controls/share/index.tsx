import cn from 'lib/classnames';

import Icon from 'components/icon';

import SHARE_SVG from 'svgs/map/share.svg?sprite';

export const Share = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn({
        'inline-flex flex-col rounded-full shadow-md shadow-black/10': true,
        [className]: !!className,
      })}
    >
      <button
        className={cn({
          'group flex h-11 w-11 items-center justify-center rounded-full bg-white disabled:cursor-default disabled:bg-gray-50 disabled:outline-none':
            true,
        })}
        aria-label="Toggle share"
        type="button"
        onClick={() => console.log('share link')}
      >
        <Icon
          icon={SHARE_SVG}
          className="h-5 w-5 bg-white group-hover:opacity-50 group-disabled:fill-grey-75"
          description="Share"
        />
      </button>
    </div>
  );
};

export default Share;
