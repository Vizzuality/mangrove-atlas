import { useCallback, useState } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import LocationsList from 'containers/locations-list';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/dialog';
import Icon from 'components/icon';

import AREA_SVG from 'svgs/sidebar/area.svg?sprite';
import GLASS_SVG from 'svgs/sidebar/glass.svg?sprite';
import GLOBE_SVG from 'svgs/sidebar/globe.svg?sprite';

import { STYLES } from '../constants';

const Place = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { asPath, replace } = useRouter();

  const { default: map } = useMap();

  const openMenu = useCallback(() => {
    if (!isOpen) setIsOpen(true);
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleWorldwideView = useCallback(async () => {
    const queryParams = asPath.split('?')[1];

    await replace(`/?${queryParams}`, null);

    map.flyTo({
      center: [0, 20],
      zoom: 2,
    });
  }, [asPath, replace, map]);

  return (
    <div className="flex flex-col space-y-2 text-center">
      <div className="font-sans text-xxs leading-[10px] text-white">Place</div>
      <div className={`${STYLES['icon-wrapper']} space-y-4 rounded-full bg-white py-1`}>
        <button
          type="button"
          className="flex cursor-pointer items-center justify-center rounded-full"
          onClick={handleWorldwideView}
        >
          <Icon icon={GLOBE_SVG} className="h-8 w-8 fill-current text-brand-800" />
        </button>
        <Dialog open={isOpen}>
          <DialogTrigger>
            <div
              onClick={openMenu}
              className="flex cursor-pointer items-center justify-center rounded-full"
            >
              <Icon icon={GLASS_SVG} className="h-8 w-8 fill-current text-brand-800" />
            </div>
          </DialogTrigger>
          <DialogContent
            className="h-[90vh] w-[540px] rounded-[20px] px-10 pt-10 pb-0"
            onEscapeKeyDown={closeMenu}
            onInteractOutside={closeMenu}
          >
            <LocationsList onSelectLocation={closeMenu} />
            <DialogClose onClose={closeMenu} />
          </DialogContent>
        </Dialog>
        <button
          type="button"
          className={cn({
            'h-10.5 flex w-10.5 cursor-pointer items-center justify-center rounded-full': true,
          })}
        >
          <Icon icon={AREA_SVG} className="h-8 w-8 fill-current text-brand-800" />
        </button>
      </div>
    </div>
  );
};

export default Place;
