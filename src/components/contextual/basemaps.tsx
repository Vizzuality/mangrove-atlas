import { MouseEvent } from 'react';

import Image from 'next/image';

import cn from 'lib/classnames';

import { basemapAtom } from 'store/map';

import { useRecoilState } from 'recoil';

import BASEMAPS, { BasemapId } from 'containers/datasets/contextual-layers/basemaps';

import { Checkbox, CheckboxIndicator } from 'components/ui/checkbox';
import Icon from 'components/ui/icon';

import CHECK_SVG from 'svgs/ui/check.svg?sprite';

const BasemapsMapSettings = () => {
  const [basemapStored, setBasemap] = useRecoilState(basemapAtom);

  const handleClick = (e: MouseEvent) => {
    setBasemap(e.currentTarget.id as BasemapId);
  };

  return (
    <div className="flex w-full space-x-4 pr-4">
      {BASEMAPS.map(({ id, name }) => (
        <div key={id} className="relative flex w-1/3 flex-col space-y-0.5">
          <button
            id={id}
            type="button"
            onClick={handleClick}
            data-testid={id}
            className={cn({
              'relative h-[80px] rounded-2xl border-2 border-transparent': true,
              'border-brand-800': basemapStored === id,
            })}
          >
            <Image
              src={`/images/thumbs/basemaps/basemap-${id}.jpg`}
              alt={name}
              fill
              quality={100}
              className="rounded-[14px]"
              style={{ objectFit: 'cover' }}
            />
            <Checkbox
              className={cn({
                'absolute bottom-2 right-2 h-6 w-6 rounded-full border-none': true,
              })}
              checked={basemapStored === id}
            >
              <CheckboxIndicator className="text-white">
                <Icon
                  icon={CHECK_SVG}
                  className="h-full w-full fill-current text-white"
                  description="Checkmark"
                />
              </CheckboxIndicator>
            </Checkbox>
          </button>

          <span
            className={cn({
              'flex-1 cursor-pointer py-1 text-center text-sm text-black/85': true,
              'font-semibold text-brand-800': basemapStored === id,
            })}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BasemapsMapSettings;
