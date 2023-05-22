import { useEffect, useState, useRef } from 'react';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { useLocation } from 'containers/datasets/locations/hooks';
import LocationsList from 'containers/locations-list';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';

const LocationTitle = () => {
  const {
    query: { params },
  } = useRouter();
  const locationType = params?.[0];
  const id = params?.[1];
  const {
    data: { name },
  } = useLocation(locationType, id, {
    enabled: !!locationType && !!id,
  });

  const [width, setWidth] = useState(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const { width } = titleRef?.current.getBoundingClientRect();
    setWidth(width);
  }, [name]);
  return (
    <>
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
              {!!locationType ? name : 'Worldwide'}
            </h1>
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
