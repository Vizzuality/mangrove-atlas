'use client';

import { useLocationsByIds } from 'containers/datasets/locations/hooks';
import cn from 'lib/classnames';
import { useState } from 'react';
import { LuX } from 'react-icons/lu';

const SAVED_AREAS = [
  'worldwide',
  '0afabe7c-db39-55b4-b9ca-44e72af46be5',
  '404d005a-797d-5509-91eb-e17ed1069ed6',
  'c11c31de-e8aa-510d-bca5-b6c48cec4b04',
  'e89f1a65-6ca1-59a3-ab84-38bf25f12ee6',
];

const LocationItem = ({ name }) => {
  const [isActive, setIsActive] = useState(true);

  const handleClick = () => {
    // TO - DO
    // Handle subscription toggle logic here
  };

  const data = useLocationsByIds(SAVED_AREAS).map((query) => query.data);
  console.log('location data in saved areas:', data);
  return (
    <li className="flex items-center justify-between">
      <span
        className={cn({
          'first-letter:uppercase': true,
          'font-bold text-brand-800': name === 'worldwide',
        })}
      >
        {name}
      </span>
      <button
        className="border-brand/80 flex shrink-0 items-center justify-center rounded-full border-2 p-1 text-brand-800"
        onClick={handleClick}
      >
        <LuX className="h-5 w-5 stroke-2" />
      </button>
    </li>
  );
};

export default LocationItem;
