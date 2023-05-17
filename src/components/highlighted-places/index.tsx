import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import {
  useHighlightedPlaces,
  useLocation,
  HIGHLIGHTED_PLACES,
} from 'containers/datasets/locations/hooks';

const HighlightedPlaces = () => {
  const { data } = useHighlightedPlaces();
  const {
    query: { locationType, id },
  } = useRouter();
  const {
    data: { location_id },
  } = useLocation(locationType, id);
  const isHighlightedPlace = !!HIGHLIGHTED_PLACES.includes(location_id);

  return (
    <div className="flex justify-between space-x-6">
      {data.map((d) => {
        if (location_id !== d.location_id)
          return (
            <Link
              key={d.location_id}
              href={`/${d.location_type}/${d.location_id}`}
              className="flex flex-1"
            >
              <div
                className={cn({
                  'flex h-60 flex-1 rounded-[20px] bg-cover bg-center': true,
                  'bg-rufiji': d.location_id === '0edd0ebb-892b-5774-8ce5-08e0ba7136b1',
                  'bg-saloum': d.location_id === '4a79230b-7ecb-58ae-ba0d-0f57faa2a104',
                })}
              >
                <h3 className="m-auto flex h-full items-end justify-center pb-4 text-end font-sans text-sm font-bold text-white">
                  {d.name}
                </h3>
              </div>
            </Link>
          );
      })}
      {isHighlightedPlace && (
        <Link href="/" className="flex flex-1">
          <div
            className={`flex h-60 flex-1 rounded-[20px] bg-[url('/images/highlighted-places/worldwide.jpg')] bg-cover bg-center`}
          >
            <h3 className="m-auto flex h-full items-end justify-center pb-4 text-end font-sans text-sm font-bold text-white">
              Worldwide
            </h3>
          </div>
        </Link>
      )}
    </div>
  );
};

export default HighlightedPlaces;
