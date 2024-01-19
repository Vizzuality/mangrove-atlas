import LocationsList from 'containers/locations-list';

import { DialogContent, DialogClose } from 'components/dialog';

const LocationDialogContent = ({ close }: { close: () => void }) => {
  return (
    <DialogContent
      className="mb-20 !w-[540px]"
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
