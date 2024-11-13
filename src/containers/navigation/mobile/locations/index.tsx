import { useCallback, useState } from 'react';

import LocationsList from 'containers/locations-list';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/ui/dialog';
import Icon from 'components/ui/icon';

import GLASS_SVG from 'svgs/sidebar/glass.svg?sprite';

const LocationsMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = useCallback(() => {
    if (!isOpen) setIsOpen(true);
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="flex h-full flex-col space-y-1.5 text-center">
      <Dialog open={isOpen}>
        <DialogTrigger asChild>
          <button
            onClick={openMenu}
            className="mt-1 flex cursor-pointer items-center justify-center rounded-full"
          >
            <Icon
              icon={GLASS_SVG}
              className="h-8 w-8 fill-white stroke-white"
              description="Glass"
            />
          </button>
        </DialogTrigger>
        <DialogContent
          className="top-0 min-h-screen w-screen rounded-none pt-4 pb-0"
          onEscapeKeyDown={closeMenu}
          onInteractOutside={closeMenu}
        >
          <LocationsList onSelectLocation={closeMenu} />
          <DialogClose onClose={closeMenu} className="top-4" />
        </DialogContent>
      </Dialog>
      <div className="font-sans text-xxs leading-[10px] text-white">Locations</div>
    </div>
  );
};

export default LocationsMobile;
