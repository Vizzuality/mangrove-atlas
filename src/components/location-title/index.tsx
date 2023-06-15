import { useEffect, useState, useRef, useMemo } from 'react';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';
import LocationsList from 'containers/locations-list';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';
import { LOCATIONS_DIALOG_STYLES } from 'styles/locations';

const LocationTitle = () => {
  const {
    query: { params },
  } = useRouter();
  const locationType = params?.[0] as LocationTypes;
  const id = params?.[1];
  const {
    data: { name },
  } = useLocation(locationType, id, {
    enabled: (!!locationType && !!id) || locationType !== 'custom-area',
  });

  const [width, setWidth] = useState<number>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const locationName = useMemo(() => {
    if (locationType === 'custom-area') {
      return 'Custom Area';
    }

    if (locationType) {
      return name;
    }

    return 'Worldwide';
  }, [locationType, name]);

  useEffect(() => {
    const { width } = titleRef?.current.getBoundingClientRect();
    setWidth(width);
  }, [name]);

  return (
    <div className="flex flex-col text-center">
      <button className="h-10.5 flex w-10.5 cursor-pointer items-center justify-center rounded-full"></button>
      <Dialog>
        <DialogTrigger>
          <h1
            ref={titleRef}
            className={cn({
              'inline-block py-10 text-6xl font-light text-black/85 first-letter:uppercase': true,
              'text-2.75xl': width >= 540,
            })}
          >
            {locationName}
          </h1>
        </DialogTrigger>
        <DialogContent className={LOCATIONS_DIALOG_STYLES}>
          <LocationsList />
          <DialogClose />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationTitle;
