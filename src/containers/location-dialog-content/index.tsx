import LocationsList from 'containers/locations-list';

import { DialogContent, DialogClose, DialogTitle } from 'components/ui/dialog';

const LocationDialogContent = ({ close }: { close: () => void }) => {
  return (
    <DialogContent
      className="!w-[540px] md:mb-20"
      onEscapeKeyDown={close}
      onInteractOutside={close}
      data-testid="location-dialog-content"
    >
      <DialogTitle className="sr-only">Select a location</DialogTitle>
      <LocationsList onSelectLocation={close} />
      <DialogClose onClose={close} />
    </DialogContent>
  );
};

export default LocationDialogContent;
