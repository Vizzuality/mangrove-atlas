import React from 'react';

import { List } from 'react-virtualized';

import Link from 'next/link';

import { useLocations } from 'containers/datasets/locations/hooks';

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from 'components/command';

const locationNames = {
  worldwide: 'Worldwide',
  country: 'Country',
  wdpa: 'WDPA',
};

const LocationsList = () => {
  const { data: locations } = useLocations();

  const renderRow = ({ index, key }: { index: number; key: string }) => {
    return (
      <CommandItem key={key}>
        <Link
          className="flex h-8 w-full flex-1 items-center justify-between"
          href={`/${locations[index].location_type}/${locations[index].iso}`}
        >
          <p className="font-sans text-2lg text-black/85">{locations[index].name}</p>
          <span className="text-xs text-grey-800 text-opacity-90">
            {locationNames[locations[index].location_type]}
          </span>
        </Link>
      </CommandItem>
    );
  };

  return (
    <div className="no-scrollbar overflow-y-auto after:absolute after:bottom-0 after:left-0 after:h-10 after:w-full after:bg-gradient-to-b after:from-white/20 after:to-white/100 after:content-['']">
      <div className="relative flex">
        <Command className="w-full">
          <div className="fixed z-20 flex w-fit flex-col bg-white">
            <CommandInput placeholder="Type name..." className="border-none" />
            <div className="my-6 flex w-fit space-x-2">
              <Link href="" className="w-[137px]">
                <div
                  key={'currentLocation.id'}
                  className="h-52 w-full flex-1 rounded-[20px] bg-[url('/images/highlighted-places/worldwide.jpg')] bg-cover bg-center"
                >
                  <h3 className="flex h-full items-end justify-center pb-4 text-end font-sans text-sm font-bold text-white">
                    Worldwide
                  </h3>
                </div>
              </Link>
              <Link href="" className="w-[137px]">
                <div
                  key={'currentLocation.id'}
                  className="h-52 w-full flex-1 rounded-[20px] bg-[url('/images/highlighted-places/rufiji.jpg')] bg-cover bg-center"
                >
                  <h3 className="flex h-full items-end justify-center pb-4 text-end font-sans text-sm font-bold text-white">
                    Worldwide
                  </h3>
                </div>
              </Link>
              <Link href="" className="w-[137px]">
                <div
                  key={'currentLocation.id'}
                  className="h-52 w-full flex-1 rounded-[20px] bg-[url('/images/highlighted-places/saloum.png')] bg-cover bg-center"
                >
                  <h3 className="flex h-full items-end justify-center pb-4 text-end font-sans text-sm font-bold text-white">
                    Worldwide
                  </h3>
                </div>
              </Link>
            </div>
          </div>
          <CommandList className="top-10] absolute mt-[300px]">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <List
                width={430}
                height={700}
                rowHeight={25}
                rowRenderer={renderRow}
                rowCount={locations.length}
                overscanRowCount={3}
                className="no-scrollbar overflow-hidden rounded-sm"
              />
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  );
};

export default LocationsList;
