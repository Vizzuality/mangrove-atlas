import React, { useState } from 'react';

import Link from 'next/link';

import cn from 'lib/classnames';

// react types
import cx from 'classnames';

import Icon from 'components/icon';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as locations from './constants.json';
const { data } = locations;

const locationNames = {
  worldwide: 'Worldwide',
  country: 'Country',
  wdpa: 'WDPA',
};

const LocationsList = ({ ...rest }) => {
  const [search, setSearch] = useState('');
  return (
    <>
      <div className={cx('relative flex w-full border-b border-gray-400 px-4')}>
        <Icon
          icon={CLOSE_SVG}
          className={cx({
            'w-4.5 h-4.5 absolute top-1/2 left-1 -translate-y-1/2 transform': true,
          })}
        />

        <input
          placeholder="Type name"
          type="search"
          className={cx(
            'w-full truncate bg-transparent pl-5 font-sans leading-4 placeholder-gray-300 placeholder-opacity-50 focus:outline-none'
          )}
        />

        {search !== '' && (
          <button
            aria-label="close"
            className="relative flex h-5 w-5 items-center justify-center self-center"
            type="button"
          >
            <Icon icon={CLOSE_SVG} className="inline-block h-2 w-2" />
          </button>
        )}
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
