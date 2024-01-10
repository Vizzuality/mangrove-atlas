import { MouseEvent } from 'react';

import Image from 'next/image';

import cn from 'lib/classnames';

import { basemapAtom } from 'store/map';

import { useRecoilState } from 'recoil';

import BASEMAPS, { BasemapId } from 'containers/datasets/contextual-layers/basemaps';

import { Checkbox, CheckboxIndicator } from 'components/checkbox';
import Icon from 'components/icon';

import CHECK_SVG from 'svgs/ui/check.svg?sprite';

const BasemapsMapSettings = () => {
  const [basemapStored, setBasemap] = useRecoilState(basemapAtom);

  const handleClick = (e: MouseEvent) => {
    setBasemap(e.currentTarget.id as BasemapId);
  };

  return (
    <div className="flex items-center space-x-4 py-1">
      {BASEMAPS.map(({ id, name }) => (
        <div key={id} className="relative flex w-full flex-1 flex-col space-y-0.5">
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

          <span className="flex-1 cursor-pointer py-1 text-center text-sm font-semibold text-brand-800">
            {name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BasemapsMapSettings;
