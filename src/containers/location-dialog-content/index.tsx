import LocationsList from 'containers/locations-list';

import { DialogContent, DialogClose } from 'components/ui/dialog';

const LocationDialogContent = ({ close }: { close: () => void }) => {
  return (
    <DialogContent
      className="!w-[540px] md:mb-20"
      onEscapeKeyDown={close}
      onInteractOutside={close}
      data-testid="location-dialog-content"
    >
      <LocationsList onSelectLocation={close} />
      <DialogClose className="fixed !top-18 left-[595px]" onClose={close} />
    </DialogContent>
  );
};

export default LocationDialogContent;
