'use client';

import { useLocationsByIds } from 'containers/datasets/locations/hooks';
import { useState } from 'react';

import LocationItem from './item';
import { useGetUserLocations } from 'containers/datasets/locations/user-locations';

const SAVED_AREAS = [
  'worldwide',
  '0afabe7c-db39-55b4-b9ca-44e72af46be5',
  '404d005a-797d-5509-91eb-e17ed1069ed6',
  'c11c31de-e8aa-510d-bca5-b6c48cec4b04',
  'e89f1a65-6ca1-59a3-ab84-38bf25f12ee6',
];

const SavedAreasContent = () => {
  const [isActive, setIsActive] = useState(true);
  const handleClick = () => {
    // Handle subscription toggle logic here
  };

  const { data } = useGetUserLocations();
  const locations = useLocationsByIds(SAVED_AREAS).map((query) => query.data);

  console.log('location data in saved areas:', locations, data);
  return (
    <div className="flex flex-col space-y-6">
      <p className="text-lg">
        You can save <span className="font-bold">up to 5 areas.</span> Select one to analyse.
      </p>
      <div className="flex flex-col space-y-4">
        {/* {!!locations.length &&
          locations?.map(({ name }) => (
            <div key={name} className="mb-4">
              <LocationItem name={name} />
            </div>
          ))} */}
      </div>
    </div>
  );
};

export default SavedAreasContent;
