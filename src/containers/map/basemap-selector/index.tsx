import Image, { StaticImageData } from 'next/image';

import cn from 'lib/classnames';

import { basemapAtom } from 'store/map';

import { useRecoilState } from 'recoil';

import BASEMAPS from 'containers/layers/basemaps';

import darkThumb from 'images/thumbs/btn-dark@2x.png';
import lightThumb from 'images/thumbs/btn-light@2x.png';
import satelliteThumb from 'images/thumbs/btn-satellite@2x.png';

const THUMBS = {
  light: lightThumb as StaticImageData,
  dark: darkThumb as StaticImageData,
  satellite: satelliteThumb as StaticImageData,
};

const BasemapSelector = ({ className }: { className?: string }) => {
  const [basemapSelected, setBasemap] = useRecoilState(basemapAtom);

  const currentBasemap = BASEMAPS.find((basemap) => basemap.id === basemapSelected);

  return (
    <div
      className={cn({
        'flex w-full items-center justify-between rounded-lg bg-white px-5 py-4 shadow-medium':
          true,
        [className]: !!className,
      })}
    >
      <div className="mr-2 md:mr-[30px]">
        <h3 className="m-0 whitespace-nowrap text-xs font-semibold uppercase leading-6">
          Map style
        </h3>
        <div className="mt-1 whitespace-nowrap text-xs md:text-base">{currentBasemap.name}</div>
      </div>
      <div className="flex items-center space-x-2 md:space-x-2.5">
        {BASEMAPS.map(({ id, name }) => (
          <button
            key={id}
            type="button"
            data-basemap={id}
            className={cn({
              'h-[45px] w-[35px] overflow-hidden rounded-3xl bg-transparent bg-cover bg-center p-0 transition-all duration-500 ease-in-out hover:shadow-[0_2px_5px_0_rgba(7,127,172,0.43)]':
                true,
              'border-2 border-brand-800 shadow-soft': currentBasemap.id === id,
            })}
            onClick={() => setBasemap(id)}
          >
            <Image src={THUMBS[id] as StaticImageData} alt={name} width={35} height={45} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default BasemapSelector;
