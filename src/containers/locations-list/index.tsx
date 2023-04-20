import React, { useRef } from 'react';

import Link from 'next/link';

import { Input } from 'components/input';

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
    <>
      <div className="relative flex w-full border-b border-gray-400 px-4">
        <Input
          // {...inputProps}
          ref={ref}
          // value={value}
          placeholder="Type name"
          type="search"
          className="w-full truncate bg-transparent pl-5 font-sans leading-4 placeholder-gray-300 placeholder-opacity-50 focus:outline-none"
          onChange={(e) => console.log(e.target.value)}
        />
      </div>
      <div className="my-6 flex w-full flex-1 space-x-2">
        <Link href="" className="flex-1">
          <div
            key={'currentLocation.id'}
            className="h-52 w-full flex-1 rounded-[20px] bg-[url('/images/highlighted-places/worldwide.jpg')] bg-cover bg-center"
          >
            <h3 className="flex h-full items-end justify-center pb-4 text-end font-sans text-sm font-bold text-white">
              Worldwide
            </h3>
          </div>
        </Link>
        <Link href="" className="flex-1">
          <div
            key={'currentLocation.id'}
            className="h-52 w-full flex-1 rounded-[20px] bg-[url('/images/highlighted-places/rufiji.jpg')] bg-cover bg-center"
          >
            <h3 className="flex h-full items-end justify-center pb-4 text-end font-sans text-sm font-bold text-white">
              Worldwide
            </h3>
          </div>
        </Link>
        <Link href="" className="flex-1">
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
      <ul className="space-y-2 font-sans">
        {data.map(({ id, iso, name, location_type }) => (
          <li key={id} className="flex w-full flex-1">
            <Link href={`/${iso}`} className="flex w-full flex-1 items-center justify-between">
              <span className="text-xl leading-[30px]">{name}</span>
              {location_type && (
                <span className="text-xs text-grey-800 text-opacity-90">
                  {locationNames[location_type]}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default LocationsList;
