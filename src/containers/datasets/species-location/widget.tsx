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
  const renderRow = (props) => {
    const { index, key } = props;
    return (
      <CommandItem key={key}>
        <p className="font-sans text-sm text-black/85">{data?.data[index].scientific_name}</p>
      </CommandItem>
    );
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && isFetched && (
        <>
          <div className="relative">
            <p className="pb-10 text-lg font-light text-black/85">
              Select one species from the list below to see where it’s located.
            </p>
            <div className="absolute left-0 right-0 bottom-0 h-1 border-b border-dashed border-brand-400 border-opacity-50" />
          </div>

          <Command className="relative w-full">
            <div className="w-full py-10">
              <CommandInput
                placeholder="Search species..."
                className="w-full rounded-[20px] border-brand-400 text-sm"
              />
            </div>
            <CommandList className="">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {/* <RadioGroup options={options} /> */}
                <List
                  width={430}
                  height={100}
                  rowHeight={25}
                  rowRenderer={renderRow}
                  rowCount={data?.data?.length}
                  overscanRowCount={3}
                  className="no-scrollbar"
                />
              </CommandGroup>
            </CommandList>
          </Command>
        </>
      )}
    </div>
  );
};

export default SpeciesLocation;
