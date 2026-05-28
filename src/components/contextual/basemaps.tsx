import { MouseEvent } from 'react';

import Image from 'next/image';

import cn from '@/lib/classnames';

import { useSyncBasemap } from '@/store/map';

import BASEMAPS, { BasemapId } from '@/containers/datasets/contextual-layers/basemaps';

import CHECK_SVG from '@/svgs/ui/check';

const BasemapsMapSettings = () => {
  const [basemapStored, setBasemap] = useSyncBasemap();

  const handleClick = (e: MouseEvent) => {
    setBasemap(e.currentTarget.id as BasemapId);
  };

  return (
    <div className="flex w-full space-x-4 pr-4">
      {BASEMAPS.map(({ id, name }) => {
        const isSelected = basemapStored === id;
        return (
          <div key={id} className="relative flex w-1/3 flex-col space-y-0.5">
            <button
              id={id}
              type="button"
              onClick={handleClick}
              data-testid={id}
              aria-pressed={isSelected}
              className={cn({
                'relative h-[80px] cursor-pointer rounded-2xl border-2 border-transparent': true,
                'border-brand-800': isSelected,
              })}
            >
              <Image
                src={`/images/thumbs/basemaps/basemap-${id}.jpg`}
                alt={name}
                fill
                quality={100}
                className="cursor-pointer rounded-[14px]"
                style={{ objectFit: 'cover' }}
              />
              {isSelected && (
                <span
                  aria-hidden="true"
                  className="bg-brand-800 absolute right-2 bottom-2 flex h-6 w-6 items-center justify-center rounded-full"
                >
                  <CHECK_SVG className="h-full w-full fill-current text-white" aria-hidden="true" />
                </span>
              )}
            </button>

            <span
              className={cn({
                'flex-1 cursor-pointer py-1 text-center text-sm text-black/85': true,
                'text-brand-800 font-semibold': isSelected,
              })}
            >
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default BasemapsMapSettings;
