import { useCallback, useState } from 'react';

import LocationsList from '@/containers/locations-list';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import GLASS_SVG from '@/svgs/sidebar/glass';

const LocationsMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = useCallback(() => {
    if (!isOpen) setIsOpen(true);
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Dialog open={isOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <button
              type="button"
              onClick={openMenu}
              aria-label="Locations"
              className="flex w-14 cursor-pointer flex-col items-center justify-center space-y-1 text-white transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none"
            >
              <GLASS_SVG
                className="h-8 w-8 fill-current fill-white stroke-white"
                role="img"
                title="Glass"
              />
              <span className="text-xxs font-sans leading-none text-white">Locations</span>
            </button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">Search locations</TooltipContent>
      </Tooltip>
      <DialogContent
        className="top-0 min-h-screen w-screen rounded-none pt-4 pb-0"
        onEscapeKeyDown={closeMenu}
        onInteractOutside={closeMenu}
      >
        <DialogTitle className="sr-only">Locations</DialogTitle>
        <LocationsList onSelectLocation={closeMenu} />
        <DialogClose onClose={closeMenu} className="top-4" />
      </DialogContent>
    </Dialog>
  );
};

export default LocationsMobile;
