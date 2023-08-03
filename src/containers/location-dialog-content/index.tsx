import LocationsList from 'containers/locations-list';

import { DialogContent, DialogClose } from 'components/dialog';
import { LOCATIONS_DIALOG_STYLES } from 'styles/locations';

const LocationDialogContent = ({ close }: { close: () => void }) => {
  return (
    <DialogContent
      className={`${LOCATIONS_DIALOG_STYLES} h-[90vh] w-[540px]`}
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
