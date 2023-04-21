import React, { useRef } from 'react';

import Link from 'next/link';

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from 'components/command';

import * as locations from './constants.json';

const { data } = locations;

const locationNames = {
  worldwide: 'Worldwide',
  country: 'Country',
  wdpa: 'WDPA',
};

const LocationsList = ({ ...rest }) => {
  const ref = useRef();
  ('');

  return (
    <div className="no-scrollbar overflow-y-auto p-4">
      <div className="relative flex w-full">
        <Command>
          <CommandInput placeholder="Type name..." />
          <div className="my-6 flex space-x-2">
            <Link href="" className="w-[147px]">
              <div
                key={'currentLocation.id'}
                className="h-52 w-full flex-1 rounded-[20px] bg-[url('/images/highlighted-places/worldwide.jpg')] bg-cover bg-center"
              >
                <h3 className="flex h-full items-end justify-center pb-4 text-end font-sans text-sm font-bold text-white">
                  Worldwide
                </h3>
              </div>
            </Link>
            <Link href="" className="w-[147px]">
              <div
                key={'currentLocation.id'}
                className="h-52 w-full flex-1 rounded-[20px] bg-[url('/images/highlighted-places/rufiji.jpg')] bg-cover bg-center"
              >
                <h3 className="flex h-full items-end justify-center pb-4 text-end font-sans text-sm font-bold text-white">
                  Worldwide
                </h3>
              </div>
            </Link>
            <Link href="" className="w-[147px]">
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
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <ul className="space-y-2 font-sans">
                {data.map(({ id, iso, name, location_type }) => (
                  <CommandItem key={id} className="flex w-full flex-1">
                    <Link
                      href={`/${iso}`}
                      className="flex w-full flex-1 items-center justify-between"
                    >
                      <span className="text-xl leading-[30px]">{name}</span>
                      {location_type && (
                        <span className="text-xs text-grey-800 text-opacity-90">
                          {locationNames[location_type]}
                        </span>
                      )}
                    </Link>
                  </CommandItem>
                ))}
              </ul>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  );
};

export default LocationsList;
