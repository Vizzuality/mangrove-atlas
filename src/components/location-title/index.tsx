import { currentLocationAtom } from 'store/location';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';
import LocationsList from 'containers/locations-list';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';

const LocationTitle = () => {
  const currentLocationId = useRecoilValue(currentLocationAtom);
  const {
    data: { name },
  } = useLocation(currentLocationId);

  return (
    <>
      <div className="flex flex-col text-center">
        <button className="h-10.5 flex w-10.5 cursor-pointer items-center justify-center rounded-full"></button>
        <Dialog>
          <DialogTrigger>
            <div className="py-10 text-6xl font-light text-black/85">{name}</div>
          </DialogTrigger>
          <DialogContent className="h-[90vh] w-[540px] rounded-[20px] px-10 pt-10 pb-0">
            <LocationsList />
            <DialogClose />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default LocationTitle;
