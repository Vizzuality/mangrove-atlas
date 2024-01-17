import LocationsList from 'containers/locations-list';

import { DialogContent, DialogClose } from 'components/dialog';

const LocationDialogContent = ({ close }: { close: () => void }) => {
  return (
    <DialogContent
      className="!w-[540px]"
      onEscapeKeyDown={close}
      onInteractOutside={close}
      data-testid="location-dialog-content"
    >
      <LocationsList onSelectLocation={close} />
      <DialogClose onClose={close} />
    </DialogContent>
  );
};

export default LocationDialogContent;
