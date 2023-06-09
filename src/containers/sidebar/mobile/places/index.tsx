import { useCallback, useState } from 'react';

import LocationsList from 'containers/locations-list';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/dialog';
import Icon from 'components/icon';

import GLASS_SVG from 'svgs/sidebar/glass.svg?sprite';

const PlacesMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = useCallback(() => {
    if (!isOpen) setIsOpen(true);
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="flex flex-col space-y-1.5 text-center">
      <Dialog open={isOpen}>
        <DialogTrigger asChild>
          <button
            onClick={openMenu}
            className="mt-1 flex cursor-pointer items-center justify-center rounded-full"
          >
            <Icon icon={GLASS_SVG} className="h-8 w-8 fill-white stroke-white" />
          </button>
        </DialogTrigger>
        <DialogContent
          className="top-[2%] h-[96%] w-11/12 rounded-3xl px-6 pt-10 pb-0"
          onEscapeKeyDown={closeMenu}
          onInteractOutside={closeMenu}
        >
          <LocationsList onSelectLocation={closeMenu} />
          <DialogClose onClose={closeMenu} />
        </DialogContent>
      </Dialog>
      <div className="font-sans text-xxs leading-[10px] text-white">Places</div>
    </div>
  );
};

export default PlacesMobile;
