import { useState, useEffect } from 'react';

import { List } from 'react-virtualized';

import {
  Command,
  CommandItem,
  CommandGroup,
  CommandInput,
  CommandEmpty,
  CommandList,
} from 'components/command';
import RadioGroup from 'components/radio-group';

import { useMangroveSpeciesLocation } from './hooks';
const SpeciesLocation = () => {
  const { data, isLoading, isFetched } = useMangroveSpeciesLocation();

  return (
    <div>
      {/* {isLoading && <p>Loading...</p>} */}
      {!isLoading && isFetched && (
        <div className="relative">
          <p className="pb-10 text-lg font-light text-black/85">
            Select one species from the list below to see where it’s located.
          </p>
          <div className="absolute left-0 right-0 bottom-0 h-1 border-b border-dashed border-brand-400 border-opacity-50" />
        </div>
      )}
    </div>
  );
};

export default SpeciesLocation;
